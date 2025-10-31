// import { ReactNode, Suspense } from "react";
// import { useRoutes } from "react-router-dom";
// import routes from "~react-pages";
// import DefaultLayout from "./layouts/default-layout";
// import { cn } from "./lib/utils";

// export function App() {
//   const appRoutes = useRoutes(routes);

//   return (
//     <div className="font-poppins max-h-[100dvh]">
//       <MaxWidthContainer>
//         <Suspense fallback={<p>Loading…</p>}>
//           <DefaultLayout>{appRoutes}</DefaultLayout>
//         </Suspense>
//       </MaxWidthContainer>
//     </div>
//   );
// }

// const MaxWidthContainer = ({ children }: { children: ReactNode }) => {
//   return (
//     <div className={cn("w-full flex justify-center max-h-[100dvh]")}>
//       <div className={cn("w-full max-w-[1920px]")}>{children}</div>
//     </div>
//   );
// };
import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import DefaultLayout from "./layouts/default-layout";
import routes from "~react-pages";

function Shell() {
  const appRoutes = useRoutes(routes);
  return <DefaultLayout>{appRoutes}</DefaultLayout>;
}

export function App() {
  return (
    <IonApp>
      <IonRouterOutlet>
        <Routes>
          <Route
            path="/*"
            element={
              <Suspense fallback={<p>Loading…</p>}>
                <Shell />
              </Suspense>
            }
          />
        </Routes>
      </IonRouterOutlet>
    </IonApp>
  );
}
