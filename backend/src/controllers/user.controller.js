import {
  asyncHandler,
  ApiError,
  ApiResponse,
  uploadOnCloudinary,
} from "../utils/index.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;             // singular
    await user.save({ validateBeforeSave: false }); 

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      501,
      "something went wrong while generating refresh and access token"
    );
  }
};
//works
const registerUser = asyncHandler(async (req, res) => {
  const { username: username, email, firstName, lastName, password } = req.body;

  if (
    [ username,email, firstName, lastName, password ].some(
      (field) =>!field || field?.trim() === ""
    )
  )
  throw new ApiError(400, "All fields are Required");

  const existedUser = await User.findOne({
    $or: [{ username: username }, { email }],
  });

  if (existedUser)
    throw new Error(410, "User with Username or Email already exists ");

  if (!email.includes("@"))
    throw new ApiError(400, "Invalid email (missing @)");

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // console.log("BODY:", req.body);
  // console.log("FILES:", req.files);
  // console.log("avatarLocalPath:", avatarLocalPath);

  if (!avatarLocalPath) throw new ApiError(401, "Avatar file is required ");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) throw new ApiError(401, "Avatar file is required");

  const user = await User.create({
    firstName,
    lastName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    email,
    password,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);


  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user ");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)          //
    .cookie("refreshToken", refreshToken, cookieOptions)        //
    .status(201)
    .json(new ApiResponse(
      201, 
      // createdUser, 
      {
        user: createdUser,
        accessToken,
        refreshToken
      },
      "User Registered Successfull"
    ));
});

const loginUser = asyncHandler(async (req, res) => {
  
  const { email, password } = req.body ;
  // console.log("BODY:", req.body);
  if(!email) throw new ApiError(400,"Email not found !! 😞");

  const user = await User.findOne({ email }).select("+password");
  // console.log(user.password);
  
  if(!user) throw new ApiError(400,"User not found 🥺");
  console.log("Entered password:", password);
  console.log("Stored hash:", user.password);
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log("isPasswordCorrect:", isPasswordValid);
  if(!isPasswordValid) throw new ApiError(401,"Invalid password !! 😰");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly : true ,
    // secure : true ,
    secure: process.env.NODE_ENV === "production",      //changes 
    sameSite: "lax"
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, 
                accessToken,
                refreshToken
            },
            "User Logged In Successfully"
        )
    )
  
})

const logOutUser = asyncHandler(async (req,res)=>{
  if(req.user?._id){
    // don't delete it 
    await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken : "" }
    },
    { new : true }
  )
}

  const options = {
      httpOnly : true,        // cookie can only be edited by server
      secure : true
    }

  return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully !! 😃"))
})

const refreshAccessToken = asyncHandler(async (req, res) =>{

  const incomingRefreshToken = req.cookie.refreshAccessToken ||  req.body.refreshAccessToken

  if(!incomingRefreshToken) throw new ApiError(400,"Unautorized Request 😵‍💫");
  
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) // returns the decoded token  from incoming 

    const user = await User.findById(decodedToken?._id)

    if(!user) throw new ApiError(401,"Invalid refresh token 😵‍💫");

    if(incomingRefreshToken !== user?.refreshTokens){
      throw new ApiError(401,"refresh token expired or used 😫");      
    }

    const options = {
          httpOnly : true,
          secure: true
    }
    
    const {accessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshtoken",newRefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken : newRefreshToken
            },
            "Access token refreshed "
        )
    )

  } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid refresh Token    ☠️ ")
  }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req?.user._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if(!isPasswordCorrect) throw new ApiError(400,"Invalid Password");

  user.password = newPassword

  await user.save({validateBeforeSave: false})
  
  return res
  .status(200)
  .json(new ApiResponse(
    200,
    {},
    "Password Changed Successfully 😃😃"
  ))
})

const getCurrentUser = asyncHandler(async(req, res) => {
  return res
  .status(200)
  .json(200, req.user,"current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req, res) => {

  const {firstName, lastName, email} = req.body;

  if(!firstName|| !lastName || !email)   throw new ApiError(400, "all fields are required ");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        firstName: firstName, 
        lastName: lastName,
        email: email
      }
    },
    {new : true}
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse (200, user ,"Accounts detailed upated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res)=> {
  const avatarLocalPath = req.file?.path
  if(!avatarLocalPath) throw new ApiError(400, "Avatar local path is missing 😰");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if(!avatar.url) throw new ApiError(400, "Error while Uploading avatar -- URL not found ❌");

  const user = await User.findByIdAndUpdate(
    req.file?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-password")

   return res
    .status(200)
    .json(new ApiResponse (200, user ,"Avatar image upated successfully"))

})
 

export {
  // generateAccessAndRefreshToken,
  // refreshToken,
  // accessToken,
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar

};

