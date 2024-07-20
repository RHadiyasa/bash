import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

const EditProfile = ({ bankSampahProfile }) => {
  return (
    <div>
      <Form>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <div className="text-sm pl-2">Username</div>
            <Input value={bankSampahProfile.username} />
          </div>
          <div className="grid gap-1">
            <div className="text-sm pl-2">Full Name</div>
            <Input value={bankSampahProfile.fullName ?? "Not set"} />
          </div>
          <div className="grid gap-1">
            <div className="text-sm pl-2">Email</div>
            <Input value={bankSampahProfile.email} />
          </div>
          <div className="grid gap-1">
            <div className="text-sm pl-2">Whatsapp</div>
            <Input value={bankSampahProfile.phone ?? "Not set"} />
          </div>
        </div>
        <div className="mt-5">
          <Button>Submit Data</Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProfile;
