// import { ReactNode } from "react";
// import { NAV_ITEMS } from "@/config/navbar";
// import { cn } from "@/lib/utils";
// import ResponsiveNav from "@/components/ResponsiveNav";

// export default function DefaultLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex h-full flex-col lg:flex-row min-h-[100dvh] max-h-[100dvh]">
//       <ResponsiveNav
//         items={NAV_ITEMS}
//         logo={{ src: "", alt: "MySite", href: "/" }}
//         user={{
//           name: "Jane Doe",
//           href: "/profile",
//         }}
//         mobileContent={
//           <main className={cn("flex-1 overflow-y-auto")}>
//             <div className="w-full bg-[#F2F3F5] h-full p-4">{children}</div>
//           </main>
//         }
//       />

//       {/* Desktop content pane (scrollable). Hidden on mobile. */}
//       <main className="hidden lg:block flex-1 h-full overflow-y-auto bg-[#F2F3F5]">
//         <div
//           className={cn(
//             "w-full min-h-full overflow-x-hidden max-w-xl mx-auto bg-[#F2F3F5]"
//           )}
//         >
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }
import { ReactNode } from "react";
import { NAV_ITEMS } from "@/config/navbar";
import { cn } from "@/lib/utils";
import ResponsiveNav from "@/components/ResponsiveNav";

function MaxWidthContainer({ children }: { children: ReactNode }) {
  // No overflow/scroll here—IonContent in each page owns scrolling.
  return (
    <div className="w-full flex justify-center">
      {/* set your desired site-wide max width */}
      <div className="w-full max-w-[1920px]">{children}</div>
    </div>
  );
}

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <MaxWidthContainer>
      <div className="flex h-full flex-col lg:flex-row min-h-[100dvh] max-h-[100dvh]">
        <ResponsiveNav
          items={NAV_ITEMS}
          logo={{ src: "", alt: "MySite", href: "/" }}
          user={{ name: "Jane Doe", href: "/profile" }}
          // Mobile content area: do NOT give it overflow; IonContent scrolls.
          mobileContent={
            <main className="flex-1">
              <div className="w-full bg-[#F2F3F5] h-full p-4">{children}</div>
            </main>
          }
        />

        {/* Desktop content pane: width-limit + center; no scrolling here */}
        <main className="hidden lg:block flex-1 h-full bg-[#F2F3F5]">
          <div
            className={cn(
              "w-full min-h-full overflow-x-hidden max-w-xl mx-auto bg-[#F2F3F5]"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </MaxWidthContainer>
  );
}
