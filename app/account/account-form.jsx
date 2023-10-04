"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AccountForm({ session }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);

      let { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded shadow-md max-w-lg mx-auto mt-10">
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-white-600"
        >
          Email
        </label>
        <input
          id="email"
          type="text"
          value={session?.user.email}
          disabled
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-600"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-600"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-600"
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <button
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          onClick={() =>
            updateProfile({ fullname, username, website, avatar_url })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
      <div>
        <form action="/auth/signout" method="post">
          <button
            className="w-full bg-black text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
