import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import { FormField } from "../components/FormField";
import { UserProfileApi } from "../../services/ProfileUserAPi";
export function ProfilePage() {
  const [profile, setProfile] = useState({
    user: {
      name: "",
      email: "",
      mobileNo: "",
    },
    address: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await UserProfileApi();
        console.log("Fetched profile data:", userData);
        setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call would go here
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="My Profile"
        description="Manage your account information"
      >
        {!isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center py-6">
            <div className="relative mb-4">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={formData.avatar || "/placeholder-user.jpg"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.user.name}
            </h2>
            <p className="text-gray-500 mt-1">Admin</p>

            <div className="w-full mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{profile.user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{profile.user.mobileNo}</span>
              </div>
              {/* <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{profile.address}</span>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-medium">Profile Information</h3>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Name"
                    name="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {/* <FormField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    /> */}
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    required
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {/* <div className="md:col-span-2">
                    <FormField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div> */}
                  <div className="md:col-span-2">
                    <FormField
                      label="Bio"
                      name="bio"
                      type="textarea"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      First Name
                    </h4>
                    <p className="mt-1">{profile.user.name}</p>
                  </div>
                  {/* <div>
                                        <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                                        <p className="mt-1">{profile.lastName}</p>
                                    </div> */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1">{profile.user.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p className="mt-1">{profile.user.mobileNo}</p>
                  </div>
                </div>
                {/* <div>
                  <h4 className="text-sm font-medium text-gray-500">Address</h4>
                  <p className="mt-1">{profile.address}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                  <p className="mt-1">{profile.bio}</p>
                </div> */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
