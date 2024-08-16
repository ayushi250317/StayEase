import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@src/src/components/ui/button";
import { Input } from "@src/src/components/ui/input";
import { stayeaseAxios } from "@src/src/lib/client";

const ConfirmRegistration = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const url = `http://localhost:8080/api/v1/auth/verifyEmail?email=${email}&id=${id}`;

    useEffect(() => {
        if (!id || !email) {
            toast.error("Invalid verification link!");
        }
    }, [id, email]);

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await stayeaseAxios.get(url);
            return res;
        },
        onSuccess: (res) => {
            if (res?.data.success) {
                toast.success(res?.data?.message);
                navigate('/signin');
            } else {
                toast.error(res?.data?.message);
            }
        },
        onError: (error: any) => {
            console.log("An error occurred while verifying an email.", error?.response?.data?.message);
            toast.error(error?.response?.data?.message);
        }
    });

    const handleVerify = () => {
        mutation.mutate();
    };

    return (
        <div className="flex flex-col items-center max-w-md mx-auto p-4">
            <h1 className="text-primary mb-4">Email Verification</h1>
            <div className="flex flex-col items-center space-y-4">
                <Input
                    type="text"
                    value={url}
                    readOnly
                    className="mt-1 block w-full rounded-md"
                />
                <Button onClick={handleVerify} className=" ">
                    Verify
                </Button>
            </div>
        </div>
    );
};

export default ConfirmRegistration;
