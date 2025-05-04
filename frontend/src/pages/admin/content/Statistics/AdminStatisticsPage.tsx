import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { FaMusic, FaUser, FaChartLine, FaDollarSign } from "react-icons/fa";
import TopArtistsChart from "./TopArtistsChart";
import TopSongsChart from "./TopSongsChart";
import { Card } from "react-bootstrap"; // Bạn cần đảm bảo đã cài `react-bootstrap`
import "./AdminStatisticsPage.scss";

const AdminStatisticsPage: React.FC = () => {
  return (
    <div className="admin-statistics-management">
      <Card>
        <Card.Header>📊 Thống kê hệ thống</Card.Header>
        <Card.Body>
          <Tabs.Root defaultValue="artists" className="w-full">
            <Tabs.List className="tabs-list">
              <Tabs.Trigger value="artists" className="tabs-trigger">
                <FaUser /> Nghệ sĩ
              </Tabs.Trigger>
              <Tabs.Trigger value="songs" className="tabs-trigger">
                <FaMusic /> Bài hát
              </Tabs.Trigger>
              {/* <Tabs.Trigger value="revenue" className="tabs-trigger">
                <FaDollarSign /> Doanh thu
              </Tabs.Trigger>
              <Tabs.Trigger value="listening" className="tabs-trigger">
                <FaChartLine /> Lượt nghe theo thời gian
              </Tabs.Trigger> */}
            </Tabs.List>

            <Tabs.Content value="artists" className="tabs-content">
              <TopArtistsChart />
            </Tabs.Content>
            <Tabs.Content value="songs" className="tabs-content">
              <TopSongsChart />
            </Tabs.Content>
          </Tabs.Root>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminStatisticsPage;
