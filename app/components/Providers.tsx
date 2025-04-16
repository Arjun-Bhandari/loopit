// "use clinet";
// import { ImageKitProvider } from "@imagekit/next";


// const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
// const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;



// export default function Providers({children}:{children:React.ReactNode}){
//     const authenticator = async () => {
//         try {
//           const res = await fetch("/api/imagekit-auth");
//           if (!res.ok) {
//             const errorText = await res.text();
//             throw new Error(
//               `Request failed with status  ${res.status} : ${errorText}`
//             );
//           }
//           const data = await res.json();
//           const { signature, expire, token } = data;
//           return { signature, expire, token };
//         } catch (error) {
//           console.log(error)
//           throw new Error (`Authentication request failed: ${error}`)
//         }
//       };
//     return (  
//         <ImageKitProvider
//         urlEndpoint={urlEndpoint}
//         authentication ={authenticator}
//         >

// {children}
//         </ImageKitProvider>
//       )
// }

 

"use client"
import { SessionProvider } from "next-auth/react"
export default function Providers({children}:{children:React.ReactNode}){
return(
<SessionProvider>

    {children}
</SessionProvider>
)
}