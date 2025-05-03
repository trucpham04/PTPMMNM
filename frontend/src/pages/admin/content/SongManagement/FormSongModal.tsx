import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useGenre } from "../../../../hooks/useGenre";
import { useArtist } from "../../../../hooks/useArtist";
import { useAlbum } from "../../../../hooks/useAlbum";
import { useSong } from "../../../../hooks/useSong";
import { Song, Genre, Artist, Album } from "../../../../types/music";
import "./FormSongModal.scss";

import axios from "axios";
interface CreateSongRequest {
  title: string;
  artist: number;
  featuring_artists?: number[];
  album?: number;
  genres?: number[];
  audio_file: string | File | null;
  video_file?: string | File | null;
  duration: string;
  lyrics?: string;
  release_date?: string;
  price?: string;
  is_downloadable: boolean;
  is_premium: boolean;
  slug?: string;
}

interface UpdateSongRequest {
  title?: string;
  lyrics?: string;
  price?: string;
  is_downloadable?: boolean;
  is_premium?: boolean;
  audio_file?: string | File | null;
  video_file?: string | File | null;
  featuring_artists?: number[];
  genres?: number[];
}

interface FormSongModalProps {
  show: boolean;
  onClose: () => void;
  id?: number | null;
}

const FormSongModal: React.FC<FormSongModalProps> = ({ show, onClose, id }) => {
  const { genres, getGenres } = useGenre();
  const { artists, getArtists } = useArtist();
  const { albums, getAlbums } = useAlbum();
  const { getSongById, getSongs, createSongAdmin, updateSongAdmin } = useSong();

  const [song, setSong] = useState({
    title: "",
    artist: null as number | null,
    featuring_artists: [] as number[],
    album: undefined as number | undefined,
    genres: [] as number[],
    audio_file: null as File | string | null,
    video_file: null as File | string | null,
    duration: "",
    lyrics: "",
    release_date: "",
    price: "",
    is_downloadable: false,
    is_premium: false,
  });

  const resetForm = () => {
    setSong({
      title: "",
      artist: null,
      featuring_artists: [],
      album: undefined,
      genres: [],
      audio_file: null,
      video_file: null,
      duration: "",
      lyrics: "",
      release_date: "",
      price: "",
      is_downloadable: false,
      is_premium: false,
    });
  };

  const fetchSong = useCallback(
    async (id: number) => {
      try {
        const res = await getSongById(id);
        if (!res) return toast.error("Không tìm thấy bài hát.");

        setSong({
          title: res.title || "",
          artist: res.artist?.id || null,
          featuring_artists: res.featuring_artists?.map((a) => a.id) || [],
          album: res.album?.id || undefined,
          genres: res.genres?.map((g) => g.id) || [],
          audio_file: res.audio_file || null,
          video_file: res.video_file || null,
          duration: res.duration?.toString() || "",
          lyrics: res.lyrics || "",
          release_date: res.release_date || "",
          price: res.price || "",
          is_downloadable: res.is_downloadable || false,
          is_premium: res.is_premium || false,
        });

        toast.info("Đã tải bài hát để chỉnh sửa.");
      } catch (err) {
        toast.error("Không thể tải bài hát.");
      }
    },
    [getSongById],
  );

  useEffect(() => {
    getGenres();
    getArtists();
    getAlbums();
    if (id) fetchSong(id);
  }, [id, getGenres, getArtists, getAlbums, fetchSong]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    setSong((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (key: string, selected: any) => {
    setSong((prev) => ({
      ...prev,
      [key]: selected
        ? Array.isArray(selected)
          ? selected.map((opt: any) => opt.value)
          : selected.value
        : key === "featuring_artists"
          ? []
          : undefined,
    }));
  };
  const handleFileChange = (
    field: "audio_file" | "video_file",
    file: File | null,
  ) => {
    setSong((prev) => {
      const prevFile = prev[field];

      if (prevFile && typeof prevFile !== "string") {
        URL.revokeObjectURL(prevFile);
      }

      return { ...prev, [field]: file };
    });
  };

  /* const handleSubmit = async () => {
    const {
      title,
      duration,
      audio_file,
      artist,
      genres,
      featuring_artists,
      video_file,
      lyrics,
      price,
      is_downloadable,
      is_premium,
      release_date,
      album,
    } = song;
  
    if (!title.trim()) return toast.error("Tên bài hát là bắt buộc.");
    if (!duration.trim()) return toast.error("Thời lượng là bắt buộc.");
    if (!artist) return toast.error("Phải chọn nghệ sĩ chính.");
    if (!genres || genres.length === 0)
      return toast.error("Phải chọn ít nhất một thể loại.");
    if (!id && !audio_file) return toast.error("Cần có file âm thanh.");
  
    if (!id) {
      try {
        const allSongs = await getSongs();
        const duplicate = allSongs?.some(
          (s) =>
            s.title.trim().toLowerCase() === title.trim().toLowerCase() &&
            s.artist?.id === artist &&
            (album ? s.album?.id === album : true)
        );
        if (duplicate) {
          return toast.error(
            "Bài hát cùng tên với nghệ sĩ (và album) này đã tồn tại."
          );
        }
      } catch (error) {
        toast.error("Không thể kiểm tra trùng bài hát.");
        return;
      }
    }
  
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("duration", duration.toString());
    formData.append("artist_id", artist.toString());
    formData.append("is_downloadable", is_downloadable ? "true" : "false");
    formData.append("is_premium", is_premium ? "true" : "false");
  
    genres.forEach((g) => formData.append("genres", g.toString()));
    featuring_artists?.forEach((fa) =>
      formData.append("featuring_artists", fa.toString())
    );
  
    if (lyrics?.trim()) formData.append("lyrics", lyrics.trim());
    if (release_date) formData.append("release_date", release_date);
    if (price?.trim()) formData.append("price", price.toString());
    if (album) formData.append("album_id", album.toString());
  
    if (audio_file instanceof File) {
      const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/flac"];
      if (!validAudioTypes.includes(audio_file.type)) {
        return toast.error("File âm thanh không hợp lệ. Chỉ chấp nhận .mp3, .wav, .flac.");
      }
      formData.append("audio_file", audio_file);
    }
  
    if (video_file instanceof File) {
      formData.append("video_file", video_file);
    }
  
    try {
      let response;
  
      if (id) {
        response = await axios.put(
          `http://127.0.0.1:8000/api/songs/${id}/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(
          "http://127.0.0.1:8000/api/songs/",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
  
      if (response.status === 200 || response.status === 201) {
        toast.success(id ? "Cập nhật bài hát thành công." : "Tạo bài hát thành công.");
        onClose();
        resetForm();
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi bài hát:", error);
      const detail = error?.response?.data;
      if (detail) {
        toast.error(`Lỗi: ${JSON.stringify(detail)}`);
      } else {
        toast.error("Đã xảy ra lỗi khi lưu bài hát.");
      }
    }
  }; */
  const handleSubmit = async () => {
    const {
      title,
      duration,
      audio_file,
      artist,
      genres,
      featuring_artists,
      video_file,
      lyrics,
      price,
      is_downloadable,
      is_premium,
      release_date,
      album,
    } = song;

    // Validate chuỗi
    if (!title.trim()) return toast.error("Tên bài hát là bắt buộc.");
    if (!duration.trim()) return toast.error("Thời lượng là bắt buộc.");
    if (!/^\d+$/.test(duration.trim()))
      return toast.error("Thời lượng phải là số nguyên (giây).");

    // Validate giá (nếu có)
    if (price && !/^\d+(\.\d{1,2})?$/.test(price.trim()))
      return toast.error("Giá không hợp lệ (chỉ nhận số hoặc số thập phân).");

    // Validate ngày phát hành
    if (release_date && isNaN(Date.parse(release_date)))
      return toast.error("Ngày phát hành không hợp lệ.");

    // Validate nghệ sĩ và thể loại
    if (!artist) return toast.error("Phải chọn nghệ sĩ chính.");
    if (!genres || genres.length === 0)
      return toast.error("Phải chọn ít nhất một thể loại.");

    // Validate file âm thanh khi tạo mới
    if (!id && !audio_file)
      return toast.error("Cần có file âm thanh khi tạo bài hát mới.");

    // Kiểm tra loại tệp âm thanh
    if (audio_file instanceof File && !audio_file.type.startsWith("audio/"))
      return toast.error("File âm thanh phải có định dạng audio.");

    // Kiểm tra loại tệp video
    if (video_file instanceof File && !video_file.type.startsWith("video/"))
      return toast.error("File video phải có định dạng video.");

    // Kiểm tra trùng lặp nếu là bài hát mới
    if (!id) {
      try {
        const allSongs = await getSongs();
        const duplicate = allSongs?.some(
          (s) =>
            s.title.trim().toLowerCase() === title.trim().toLowerCase() &&
            s.artist?.id === artist &&
            (album ? s.album?.id === album : true),
        );
        if (duplicate) {
          return toast.error(
            "Bài hát cùng tên với nghệ sĩ (và album) này đã tồn tại.",
          );
        }
      } catch (error) {
        toast.error("Không thể kiểm tra trùng bài hát.");
        return;
      }
    }

    // Chuẩn bị dữ liệu
    const songData: CreateSongRequest = {
      title: title.trim(),
      artist: artist!,
      genres,
      featuring_artists,
      audio_file,
      video_file,
      duration: duration.trim(),
      lyrics: lyrics?.trim(),
      release_date,
      price: price?.trim(),
      is_downloadable,
      is_premium,
      album,
    };

    // Gửi dữ liệu
    try {
      if (id) {
        await updateSongAdmin(id, songData);
        resetForm();
        toast.success("Cập nhật bài hát thành công.");
      } else {
        const response = await createSongAdmin(songData);
        resetForm();
        toast.success("Tạo bài hát thành công.");
      }
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi gửi bài hát:", error);
      toast.error("Đã xảy ra lỗi khi lưu bài hát.");
    }
  };

  const genreOptions = genres.map((g) => ({ value: g.id, label: g.name }));
  const artistOptions = artists.map((a) => ({ value: a.id, label: a.name }));
  const albumOptions = albums.map((al) => ({ value: al.id, label: al.title }));

  return (
    <div className={`overlay ${show ? "show" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h5>{id ? "Chỉnh sửa bài hát" : "Thêm bài hát"}</h5>
          <button
            className="close-button"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group quarter">
              <label>Tiêu đề</label>
              <input
                className="input"
                name="title"
                value={song.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group quarter">
              <label>Ngày phát hành</label>
              <input
                type="date"
                className="input"
                name="release_date"
                value={song.release_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group quarter">
              <label>Thời lượng (giây)</label>
              <input
                className="input"
                name="duration"
                value={song.duration}
                onChange={handleChange}
              />
            </div>
            <div className="form-group quarter">
              <label>Giá</label>
              <input
                className="input"
                name="price"
                value={song.price}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group quarter">
              <label>Nghệ sĩ chính</label>
              <Select
                options={artistOptions}
                value={artistOptions.find((opt) => opt.value === song.artist)}
                onChange={(opt) => handleSelectChange("artist", opt)}
              />
            </div>
            <div className="form-group quarter">
              <label>Nghệ sĩ hợp tác</label>
              <Select
                isMulti
                options={artistOptions}
                value={artistOptions.filter((opt) =>
                  song.featuring_artists.includes(opt.value),
                )}
                onChange={(opt) => handleSelectChange("featuring_artists", opt)}
              />
            </div>
            <div className="form-group quarter">
              <label>Album</label>
              <Select
                options={albumOptions}
                value={albumOptions.find((opt) => opt.value === song.album)}
                onChange={(opt) => handleSelectChange("album", opt)}
              />
            </div>
            <div className="form-group quarter">
              <label>Thể loại</label>
              <Select
                isMulti
                options={genreOptions}
                value={genreOptions.filter((opt) =>
                  song.genres.includes(opt.value),
                )}
                onChange={(opt) => handleSelectChange("genres", opt)}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-group full">
              <label>Lời bài hát</label>
              <textarea
                className="input"
                name="lyrics"
                rows={4}
                value={song.lyrics}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 4 - File selection */}
          <div className="form-row">
            {/* Audio */}
            <div className="form-group half">
              <label>File âm thanh</label>
              <div className="file-input-wrapper">
                <label className="custom-file-button">
                  Chọn file âm thanh
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange("audio_file", file);
                    }}
                  />
                </label>

                {song.audio_file && (
                  <div className="file-preview">
                    <div className="file-info">
                      <strong>Tên file:</strong>{" "}
                      {typeof song.audio_file === "string"
                        ? song.audio_file.split("/").pop()
                        : song.audio_file.name}
                    </div>
                    <audio
                      controls
                      key={
                        song.audio_file instanceof File
                          ? song.audio_file.name
                          : song.audio_file
                      }
                    >
                      <source
                        src={
                          typeof song.audio_file === "string"
                            ? song.audio_file
                            : URL.createObjectURL(song.audio_file)
                        }
                        type="audio/mp3"
                      />
                      Trình duyệt không hỗ trợ audio.
                    </audio>
                    {typeof song.audio_file === "string" && (
                      <div className="file-note">
                        (Đang dùng file cũ. Chọn file mới để thay thế)
                      </div>
                    )}
                    <button
                      className="remove-file-button"
                      onClick={() => handleFileChange("audio_file", null)}
                    >
                      Xóa file
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Video */}
            <div className="form-group half">
              <label>File video (nếu có)</label>
              <div className="file-input-wrapper">
                <label className="custom-file-button">
                  Chọn file video
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange("video_file", file);
                    }}
                  />
                </label>

                {song.video_file && (
                  <div className="file-preview">
                    <div className="file-info">
                      <strong>Tên file:</strong>{" "}
                      {typeof song.video_file === "string"
                        ? song.video_file.split("/").pop()
                        : song.video_file.name}
                    </div>
                    <video
                      controls
                      key={
                        song.video_file instanceof File
                          ? song.video_file.name
                          : song.video_file
                      }
                    >
                      <source
                        src={
                          typeof song.video_file === "string"
                            ? song.video_file
                            : URL.createObjectURL(song.video_file)
                        }
                        type="video/mp4"
                      />
                      Trình duyệt không hỗ trợ video.
                    </video>
                    {typeof song.video_file === "string" && (
                      <div className="file-note">
                        (Đang dùng file cũ. Chọn file mới để thay thế)
                      </div>
                    )}
                    <button
                      className="remove-file-button"
                      onClick={() => handleFileChange("video_file", null)}
                    >
                      Xóa file
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 5 - Checkboxes */}
          <div className="form-row">
            <div className="form-group half">
              <label>
                <input
                  type="checkbox"
                  name="is_downloadable"
                  checked={song.is_downloadable}
                  onChange={handleChange}
                />{" "}
                Có thể tải về
              </label>
            </div>
            <div className="form-group half">
              <label>
                <input
                  type="checkbox"
                  name="is_premium"
                  checked={song.is_premium}
                  onChange={handleChange}
                />{" "}
                Premium
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button cancel"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Đóng
          </button>
          <button className="button submit" onClick={handleSubmit}>
            {id ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSongModal;
