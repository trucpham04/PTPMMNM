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
import "./TopSongsChart.scss";

interface SongStat {
  id: number;
  name: string;
  total_play_count: number;
}

const TopSongsChart: React.FC = () => {
  const [data, setData] = useState<SongStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [topX, setTopX] = useState<number>(5); // Mặc định là 5 bài hát

  // Fetch data from the API
  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/songs/top/?x=${topX}`,
        );
        console.log("res: ", res.data.DT);
        setData(res.data.DT); // Set data to state
      } catch (error) {
        console.error("Error fetching top songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSongs();
  }, [topX]); // Re-fetch when `topX` changes

  return (
    <div className="top-songs-chart-container">
      <div className="header">
        <h2 className="text-xlll mb-4 font-semibold">
          Top {topX} Bài Hát Được Nghe Nhiều Nhất
        </h2>
        {/* Dropdown để chọn số lượng bài hát */}
        <select
          value={topX}
          onChange={(e) => setTopX(Number(e.target.value))}
          className="form-select"
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
          <option value={15}>Top 15</option>
          <option value={20}>Top 20</option>
          <option value={100}>Top 100</option>
        </select>
      </div>

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

export default TopSongsChart;
