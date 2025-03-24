export const loginApi = async (
  username: string,
  password: string,
): Promise<{ user: { id: number; username: string } }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "1234") {
        resolve({
          user: { id: 1, username: "admin" },
        });
      } else {
        reject(new Error("Thông tin đăng nhập không hợp lệ"));
      }
    }, 1000);
  });
};
