import { useState, useCallback } from "react";
import { userService } from "../services";
import { User, UserFollow } from "../types";

export const useUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<UserFollow[]>([]);
  const [following, setFollowing] = useState<UserFollow[]>([]);

  // Get all users
  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getUsers();

      if (response.EC === 0 && response.DT) {
        setUsers(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch users");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user by ID
  const getUserById = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getUserById(userId);

      if (response.EC === 0 && response.DT) {
        setUser(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch user");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(
    async (userData: Partial<User>, profilePicture?: File) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userService.createUser(userData, profilePicture);

        if (response.EC === 0 && response.DT) {
          return response.DT;
        } else {
          setError(response.EM || "Failed to create user");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create user";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update user
  const updateUser = useCallback(
    async (userId: number, userData: Partial<User>, profilePicture?: File) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userService.updateUser(
          userId,
          userData,
          profilePicture,
        );

        if (response.EC === 0 && response.DT) {
          if (user && user.id === userId) {
            setUser(response.DT);
          }
          return response.DT;
        } else {
          setError(response.EM || "Failed to update user");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  // Delete user
  const deleteUser = useCallback(
    async (userId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userService.deleteUser(userId);

        if (response.EC === 0) {
          if (user && user.id === userId) {
            setUser(null);
          }
          setUsers((prev) => prev.filter((u) => u.id !== userId));
          return true;
        } else {
          setError(response.EM || "Failed to delete user");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete user";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  // Follow user
  const followUser = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.followUser(userId);

      if (response.EC === 0) {
        return true;
      } else {
        setError(response.EM || "Failed to follow user");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to follow user";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unfollow user
  const unfollowUser = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.unfollowUser(userId);

      if (response.EC === 0) {
        return true;
      } else {
        setError(response.EM || "Failed to unfollow user");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unfollow user";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user followers
  const getUserFollowers = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getUserFollowers(userId);

      if (response.EC === 0 && response.DT) {
        setFollowers(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch followers");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch followers";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user following
  const getUserFollowing = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getUserFollowing(userId);

      if (response.EC === 0 && response.DT) {
        setFollowing(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch following");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch following";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    users,
    user,
    followers,
    following,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser,
    getUserFollowers,
    getUserFollowing,
  };
};

export default useUser;
