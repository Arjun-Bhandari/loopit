// import ImageKit from "imagekit";
// import { NextResponse } from "next/server";

// const imagekit = new ImageKit({
//     publicKey:process.env.NEXT_PUBLIC_PUBLIC_KEY!,
//     privateKey:process.env.PRIVATE_KEY!,
//     urlEndpoint:process.env.NEXT_PUBLIC_URL_ENDPOINT!,
// });

// export async function GET(){
//    try{
//        const authenticationParameters = imagekit.getAuthenticationParameters();
//        return NextResponse.json(authenticationParameters);
//    }catch(error){
//     return NextResponse.json(
//         {error:"Imagekit auth Fail"},
//         {status:500}
//     )
//    }
   
// }


import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
   try{
    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
        // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
        // token: "random-token", // Optional, a unique token for request
    })

    return Response.json({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
   }catch(error){
throw new Error("Image Kit authentication Failed")
   }

   
}