// Giả sử đây là API đăng nhập (điều này có thể thay bằng lời gọi thực tế đến server)
export const loginApi = async (
  username: string,
  password: string,
): Promise<{ user: { id: number; username: string } }> => {
  // Mô phỏng gọi API với delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Giả sử username "admin" và password "1234" là hợp lệ
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
