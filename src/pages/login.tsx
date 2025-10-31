// import { useState, useMemo } from "react";
// import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { useApiMutation } from "@/hooks/useApiMutation";
// import { endpoints } from "@/api/endpoints";
// import { Input } from "@/components/ui/input";
// import BGURL2 from "@/assets/login2.png";
// import BGURL from "@/assets/login.png";
// import BackButton from "@/components/commons/back-button";
// import CommonButton from "@/components/commons/CommonButton";
// import { useAuth } from "@/hooks/useAuth";
// import { z } from "zod";
// import { Loader2 } from "lucide-react";

// export const loginSchema = z.object({
//   email: z.string().min(1, "E-mail is required").email("Enter a valid e-mail"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });
// type LoginForm = z.infer<typeof loginSchema>;

// /* ------------------------------ page ------------------------------ */

// export default function LoginPage() {
//   const location = useLocation();

//   // Safely read prefill from nested location state
//   const prefill = useMemo(() => {
//     const s = (location?.state as any) ?? {};
//     const fromState = s?.from?.state ?? {};
//     const email = typeof fromState?.email === "string" ? fromState.email : "";
//     const password =
//       typeof fromState?.password === "string" ? fromState.password : "";
//     return { email, password };
//   }, [location?.state]);

//   const { user, isLoading } = useAuth();
//   const navigate = useNavigate();
//   const [serverError, setServerError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//     mode: "onChange",
//     // 👇 Prefill here
//     defaultValues: {
//       email: prefill.email,
//       password: prefill.password,
//     },
//   });

//   const loginMutation = useApiMutation<LoginForm, { token: string }>({
//     route: endpoints.auth.login,
//     method: "POST",
//     onSuccess: () => {
//       setServerError(null);
//       navigate("/home", { replace: true });
//     },
//     onError: (err: any) => {
//       if (err?.response?.status === 401) {
//         setServerError("User not found");
//       } else if (err?.response?.status === 404) {
//         setServerError("Invalid Credentials. Please try again.");
//       } else {
//         setServerError("The password you entered is incorrect.");
//       }
//     },
//   });

//   if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;
//   if (user) return <Navigate to="/home" replace />;

//   const onSubmit = (values: LoginForm) => {
//     loginMutation.mutate(values);
//   };

//   return (
//     <div className="text-black min-h-[100dvh] overflow-hidden relative">
//       {/* Backgrounds */}
//       <img
//         src={BGURL}
//         alt="Glass tech background"
//         className="lg:hidden h-full w-full object-fill absolute"
//       />
//       <img
//         src={BGURL2}
//         alt="Glass tech background"
//         className="hidden lg:block h-full w-full object-cover absolute"
//       />

//       {/* Mobile header */}
//       <header className="fixed inset-x-0 top-0 z-20 md:hidden h-32 bg-[#0DACAD] flex items-center gap-3 px-4">
//         <BackButton to={"/"} />
//         <h1 className="text-xl text-white">Continue with E-mail</h1>
//       </header>

//       {/* Form */}
//       <div className="absolute z-10 flex flex-col min-h-screen items-start top-[25%] md:top-0 md:justify-center px-4 sm:px-6 md:ml-16 md:p-8 md:pt-0 w-full max-w-[440px]">
//         <header className="mb-8 hidden md:flex items-center gap-3">
//           <BackButton to={"/"} />
//           <h1 className="text-lg font-medium">Continue with E-mail</h1>
//         </header>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
//           {/* Email */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-[11px] font-semibold tracking-[0.18em]"
//             >
//               E-MAIL
//             </label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="name@example.com"
//               {...register("email")}
//               className="border-0 border-b-2 focus:border-emerald-500 bg-transparent
//                          text-[15px] placeholder:text-gray-400 focus-visible:ring-0"
//               autoComplete="email"
//             />
//             {errors.email && (
//               <p className="text-xs text-red-600 mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-[11px] font-semibold tracking-[0.18em]"
//             >
//               PASSWORD
//             </label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               {...register("password")}
//               className="border-0 border-b-2 focus:border-emerald-500 bg-transparent
//                          text-[15px] placeholder:text-gray-400 focus-visible:ring-0"
//               autoComplete="current-password"
//             />
//             {errors.password && (
//               <p className="text-xs text-red-600 mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Server error */}
//           {serverError && (
//             <p className="text-sm text-red-600 mt-2">{serverError}</p>
//           )}

//           {/* CTA */}
//           <div className="pt-6 text-center">
//             <p className="mb-4 text-[13px] text-gray-600">
//               Don’t have account?{" "}
//               <Link
//                 to="/signup"
//                 className="font-semibold underline underline-offset-2"
//               >
//                 Let’s create!
//               </Link>
//             </p>

//             <CommonButton
//               text={loginMutation.isPending ? "Logging in…" : "Next"}
//               type="submit"
//               disabled={!isValid || loginMutation.isPending || isSubmitting}
//               className="disabled:opacity-50"
//             />
//           </div>
//           <p className="text-right text-[13px] mt-2">
//             <Link
//               to="/forgot-password"
//               className="underline underline-offset-2"
//             >
//               Forgot password?
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
