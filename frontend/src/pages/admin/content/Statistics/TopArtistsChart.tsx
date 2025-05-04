import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import "./TopArtistsChart.scss";
interface ArtistStat {
  id: number;
  name: string;
  total_play_count: number;
}

const TopArtistsChart: React.FC = () => {
  const [data, setData] = useState<ArtistStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/artists/top/");
        console.log("Top artist: ", res.data.DT);
        setData(res.data.DT);
      } catch (error) {
        console.error("Error fetching artist stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-[400px] w-full p-4">
      <h2 className="text-xlll mb-4 font-semibold">
        Top 10 Nghệ Sĩ Được Nghe Nhiều Nhất
      </h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="mt-5">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_play_count" fill="#8884d8" name="Lượt nghe" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TopArtistsChart;
