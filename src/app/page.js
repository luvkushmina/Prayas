"use client";
import React from "react";
import { FaPlay } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
function MainComponent() {
  const [directoryHandle, setDirectoryHandle] = React.useState(null);
  const [currentView, setCurrentView] = React.useState("folder-select"); // 'folder-select', 'subjects', 'chapters', 'files', 'video-player'
  const [subjects, setSubjects] = React.useState([]);
  const [currentSubject, setCurrentSubject] = React.useState(null);
  const [chapters, setChapters] = React.useState([]);
  const [currentChapter, setCurrentChapter] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [selectedVideo, setSelectedVideo] = React.useState(null);
  const [matchedPdf, setMatchedPdf] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [viewMode, setViewMode] = React.useState("videos"); // 'videos' or 'pdfs'

  // Check if File System Access API is supported
const [isFileSystemSupported, setIsFileSystemSupported] = React.useState(false);

React.useEffect(() => {
  if (typeof window !== "undefined" && "showDirectoryPicker" in window) {
    setIsFileSystemSupported(true);
  }
}, []);
  // Select PRAYASS folder
  const selectFolder = async () => {
    if (!isFileSystemSupported) {
      setError(
        "File System Access API is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle);
      await loadSubjects(handle);
      setCurrentView("subjects");
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Failed to access folder: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load subjects (top-level folders)
  const loadSubjects = async (handle) => {
    const subjectList = [];
    for await (const [name, fileHandle] of handle.entries()) {
      if (fileHandle.kind === "directory") {
        // Count chapters for each subject
        let chapterCount = 0;
        for await (const [chapterName, chapterHandle] of fileHandle.entries()) {
          if (chapterHandle.kind === "directory") {
            chapterCount++;
          }
        }
        subjectList.push({ name, handle: fileHandle, chapterCount });
      }
    }
    setSubjects(subjectList.sort((a, b) => a.name.localeCompare(b.name)));
  };

  // Load chapters for a subject
  const loadChapters = async (subjectHandle) => {
    setLoading(true);
    try {
      const chapterList = [];
      for await (const [name, fileHandle] of subjectHandle.entries()) {
        if (fileHandle.kind === "directory") {
          // Count videos in each chapter
          let videoCount = 0;
          for await (const [fileName, file] of fileHandle.entries()) {
            if (
              file.kind === "file" &&
              fileName.toLowerCase().endsWith(".mp4")
            ) {
              videoCount++;
            }
          }
          chapterList.push({ name, handle: fileHandle, videoCount });
        }
      }
      setChapters(chapterList.sort((a, b) => a.name.localeCompare(b.name)));
      setCurrentView("chapters");
    } catch (err) {
      setError("Failed to load chapters: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load files for a chapter
  const loadFiles = async (chapterHandle) => {
    setLoading(true);
    try {
      const fileList = [];
      for await (const [name, fileHandle] of chapterHandle.entries()) {
        if (fileHandle.kind === "file") {
          const file = await fileHandle.getFile();
          fileList.push({
            name,
            handle: fileHandle,
            file,
            type: name.toLowerCase().endsWith(".mp4")
              ? "video"
              : name.toLowerCase().endsWith(".pdf")
              ? "pdf"
              : "other",
          });
        }
      }
      setFiles(fileList.sort((a, b) => a.name.localeCompare(b.name)));
      setCurrentView("files");
      setViewMode("videos"); // Default to videos view
    } catch (err) {
      setError("Failed to load files: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Find matching PDF for a video
  const findMatchingPdf = (videoName) => {
    const baseName = videoName.replace(/\.mp4$/i, "");
    return files.find(
      (file) =>
        file.type === "pdf" &&
        (file.name.toLowerCase().includes(baseName.toLowerCase()) ||
          baseName
            .toLowerCase()
            .includes(file.name.replace(/\.pdf$/i, "").toLowerCase()))
    );
  };

  // Handle video selection
  const selectVideo = (videoFile) => {
    setSelectedVideo(videoFile);
    const pdf = findMatchingPdf(videoFile.name);
    setMatchedPdf(pdf);
    setCurrentView("video-player");
  };

  // Open PDF file
  const openPdf = async (pdfFile) => {
    try {
      const url = URL.createObjectURL(pdfFile.file);
      window.open(url, "_blank");
    } catch (err) {
      setError("Failed to open PDF: " + err.message);
    }
  };

  // Navigation functions
  const goToSubjects = () => {
    setCurrentView("subjects");
    setCurrentSubject(null);
    setCurrentChapter(null);
    setSelectedVideo(null);
    setMatchedPdf(null);
  };

  const goToChapters = () => {
    setCurrentView("chapters");
    setCurrentChapter(null);
    setSelectedVideo(null);
    setMatchedPdf(null);
  };

  const goToFiles = () => {
    setCurrentView("files");
    setSelectedVideo(null);
    setMatchedPdf(null);
  };

  // Get subject colors - now using gray tones with different shapes/icons
  const getSubjectIcon = (subjectName) => {
    const icons = {
      Physics: "fas fa-atom",
      "Physical chemistry": "fas fa-flask",
      "Organic Chemistry": "fas fa-microscope",
      Mathematics: "fas fa-calculator",
      "Inorganic Chemistry": "fas fa-vial",
    };
    return icons[subjectName] || "fas fa-book";
  };

  // Render folder selection screen
  if (currentView === "folder-select") {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-600 text-sm font-medium mb-2">
              PRAYASS
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4 font-inter">
              PRAYASS Video Browser
            </h1>
            <p className="text-gray-600 mb-8 font-roboto">
              Select your PRAYASS folder to browse videos
            </p>

            {!isFileSystemSupported ? (
              <div className="text-red-600 mb-4">
                <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p className="font-medium">
                  File System Access API not supported
                </p>
                <p className="text-sm">
                  Please use Chrome, Edge, or another Chromium-based browser
                </p>
              </div>
            ) : (
              <button
                onClick={selectFolder}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center mx-auto"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-folder-open mr-2"></i>
                    Select PRAYASS Folder
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render subjects view
  if (currentView === "subjects") {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-gray-600 text-sm font-medium mb-2">
              PRAYASS
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 font-inter">
              Choose Subject
            </h1>
            <button
              onClick={() => setCurrentView("folder-select")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center mx-auto"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Folder Selection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentSubject(subject);
                  loadChapters(subject.handle);
                }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-8 text-center border border-gray-200"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i
                    className={`${getSubjectIcon(
                      subject.name
                    )} text-gray-700 text-2xl`}
                  ></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-inter">
                  {subject.name}
                </h3>
                <p className="text-gray-500 text-sm font-roboto">
                  {subject.chapterCount} chapters available
                </p>
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center mt-8">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-600"></i>
              <p className="text-gray-600 mt-2">Loading...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render chapters view
  if (currentView === "chapters") {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="text-gray-700">PRAYASS</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span className="text-gray-700">{currentSubject?.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 font-inter">
              {currentSubject?.name} Chapters
            </h1>
            <button
              onClick={goToSubjects}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Subjects
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentChapter(chapter);
                  loadFiles(chapter.handle);
                }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-folder text-gray-700 text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 font-inter">
                      {chapter.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-roboto flex items-center">
                      <i className="fas fa-play-circle mr-1 text-xs"></i>
                      {chapter.videoCount} videos
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center mt-8">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-600"></i>
              <p className="text-gray-600 mt-2">Loading chapters...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render video player view
  if (currentView === "video-player" && selectedVideo) {
    const videoUrl = URL.createObjectURL(selectedVideo.file);

    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 border-b border-gray-700">
          <div className="flex items-center text-sm mb-2">
            <span className="text-gray-300">PRAYASS</span>
            <i className="fas fa-chevron-right mx-2 text-gray-500"></i>
            <span className="text-gray-300">{currentSubject?.name}</span>
            <i className="fas fa-chevron-right mx-2 text-gray-500"></i>
            <span className="text-gray-300">{currentChapter?.name}</span>
            <i className="fas fa-chevron-right mx-2 text-gray-500"></i>
            <span className="text-white">
              {selectedVideo.name.replace(".mp4", "")}
            </span>
          </div>
        </div>

        {/* Video Player */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-700">
            <video
              controls
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-contain"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info and PDF Section */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2 font-inter">
              {selectedVideo.name.replace(".mp4", "")}
            </h2>
            <p className="text-gray-400 mb-4 font-roboto">
              {currentSubject?.name} • {currentChapter?.name}
            </p>

            {matchedPdf && (
              <button
                onClick={() => openPdf(matchedPdf)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                <i className="fas fa-file-pdf mr-2"></i>
                View PDF Notes
              </button>
            )}

            <div className="mt-6 flex gap-4">
              <button
                onClick={goToFiles}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Files
              </button>
              <button
                onClick={goToChapters}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render files view
  if (currentView === "files") {
    const videoFiles = files.filter((file) => file.type === "video");
    const pdfFiles = files.filter((file) => file.type === "pdf");

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="text-gray-700">PRAYASS</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span className="text-gray-700">{currentSubject?.name}</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span className="text-gray-700">{currentChapter?.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 font-inter">
              {currentChapter?.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={goToChapters}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Chapters
              </button>
              <button
                onClick={() => setViewMode("videos")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  viewMode === "videos"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <i className="fas fa-play-circle mr-2"></i>
                View VIDEO mp4
              </button>
              <button
                onClick={() => setViewMode("pdfs")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  viewMode === "pdfs"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <i className="fas fa-file-pdf mr-2"></i>
                View PDF Notes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {viewMode === "videos" &&
              videoFiles.map((video, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
                  onClick={() => selectVideo(video)}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <FaPlay className="text-gray-700 text-xl" />

                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 font-inter">
                        {video.name.replace(".mp4", "")}
                      </h3>
                      <p className="text-gray-500 text-sm font-roboto">
                        Video file
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {viewMode === "pdfs" &&
              pdfFiles.map((pdf, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
                  onClick={() => openPdf(pdf)}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-file-pdf text-gray-700 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 font-inter">
                        {pdf.name.replace(".pdf", "")}
                      </h3>
                      <p className="text-gray-500 text-sm font-roboto">
                        PDF file
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

function StoryComponent() {
  return (
    <div>
      <MainComponent />
    </div>
  );
}

export default MainComponent;