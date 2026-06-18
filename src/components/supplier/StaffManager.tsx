import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Staff = {
  name: string;
  designation: string;
  phones: string[];
  emails: string[];
  photo: File | null;
};

type Props = {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
};

const StaffManager = ({ staff, setStaff }: Props) => {
  const addStaff = () => {
    setStaff((prev) => [
      ...prev,
      {
        name: "",
        designation: "",
        phones: [""],
        emails: [""],
        photo: null,
      },
    ]);
  };

  const removeStaff = (index: number) => {
    setStaff((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStaff = (index: number, key: keyof Staff, value: any) => {
    setStaff((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [key]: value } : member,
      ),
    );
  };
  const addPhone = (staffIndex: number) => {
    setStaff((prev) =>
      prev.map((member, i) =>
        i === staffIndex
          ? { ...member, phones: [...member.phones, ""] }
          : member,
      ),
    );
  };

  const removePhone = (staffIndex: number, phoneIndex: number) => {
    setStaff((prev) =>
      prev.map((member, i) =>
        i === staffIndex
          ? {
              ...member,
              phones: member.phones.filter((_, p) => p !== phoneIndex),
            }
          : member,
      ),
    );
  };

  const updatePhone = (
    staffIndex: number,
    phoneIndex: number,
    value: string,
  ) => {
    setStaff((prev) =>
      prev.map((member, i) => {
        if (i !== staffIndex) return member;

        const updatedPhones = member.phones.map((phone, p) =>
          p === phoneIndex ? value : phone,
        );

        return { ...member, phones: updatedPhones };
      }),
    );
  };
  const addEmail = (staffIndex: number) => {
    setStaff((prev) =>
      prev.map((member, i) =>
        i === staffIndex
          ? { ...member, emails: [...member.emails, ""] }
          : member,
      ),
    );
  };

  const removeEmail = (staffIndex: number, emailIndex: number) => {
    setStaff((prev) =>
      prev.map((member, i) =>
        i === staffIndex
          ? {
              ...member,
              emails: member.emails.filter((_, e) => e !== emailIndex),
            }
          : member,
      ),
    );
  };

  const updateEmail = (
    staffIndex: number,
    emailIndex: number,
    value: string,
  ) => {
    setStaff((prev) =>
      prev.map((member, i) => {
        if (i !== staffIndex) return member;

        const updatedEmails = member.emails.map((email, e) =>
          e === emailIndex ? value : email,
        );

        return { ...member, emails: updatedEmails };
      }),
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">Staff Details</h2>
        <p className="text-muted-foreground mt-2">
          Add property staff members for contact & management.
        </p>
      </div>

      {/* STAFF LIST */}
      {staff.map((member, index) => (
        <div
          key={index}
          className="border rounded-2xl p-6 space-y-6 bg-muted/10"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Staff {index + 1}</h3>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeStaff(index)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>

          {/* BASIC STAFF DETAILS */}
          <div className="grid md:grid-cols-3 gap-4 items-end">
            {/* NAME */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Name *</label>
              <Input
                className="h-12 rounded-xl"
                value={member.name}
                onChange={(e) => updateStaff(index, "name", e.target.value)}
              />
            </div>

            {/* DESIGNATION */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Designation *</label>
              <Input
                className="h-12 rounded-xl"
                value={member.designation}
                onChange={(e) =>
                  updateStaff(index, "designation", e.target.value)
                }
              />
            </div>

            {/* EMAIL */}
            {/* <div className="space-y-1">
            <label className="text-sm font-semibold">
              Email
            </label>
            <Input
            className="h-12 rounded-xl"
              type="email"
              value={member.email}
              onChange={(e) =>
                updateStaff(index, "email", e.target.value)
              }
            />
          </div> */}

            {/* PHOTO */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Photo</label>
              <Input
                type="file"
                accept="image/*"
                className="h-12 rounded-xl"
                onChange={(e: any) =>
                  updateStaff(index, "photo", e.target.files?.[0] || null)
                }
              />
            </div>
          </div>

          {/* PHONE NUMBERS (SEPARATE ROW BUT NOT FULL WIDTH) */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Phone</label>

              {member.phones.map((phone, phoneIndex) => (
                <div key={phoneIndex} className="flex gap-2">
                  <Input
                    type="mobile"
                    className="h-12 rounded-xl"
                    value={phone}
                    onChange={(e) =>
                      updatePhone(index, phoneIndex, e.target.value)
                    }
                  />

                  {phoneIndex === member.phones.length - 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => addPhone(index)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}

                  {member.phones.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removePhone(index, phoneIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {/* EMAILS */}

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Email</label>

              {member.emails.map((email, emailIndex) => (
                <div key={emailIndex} className="flex gap-2">
                  <Input
                    type="email"
                    className="h-12 rounded-xl"
                    value={email}
                    onChange={(e) =>
                      updateEmail(index, emailIndex, e.target.value)
                    }
                  />

                  {emailIndex === member.emails.length - 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => addEmail(index)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}

                  {member.emails.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeEmail(index, emailIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* ADD STAFF */}
      <Button variant="outline" onClick={addStaff}>
        <Plus className="w-4 h-4 mr-2" />
        Add Staff Member
      </Button>
    </div>
  );
};

export default StaffManager;
