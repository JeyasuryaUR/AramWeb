import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";
import React, { useEffect } from "react";

const withAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;