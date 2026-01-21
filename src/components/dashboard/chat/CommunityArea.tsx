"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Hash,
  Bell,
  Image as ImageIcon,
  X,
  Paperclip,
  Play,
  Volume2,
  VolumeX,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { useCommunity } from "@/hooks/useCommunity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Utility function to render text with clickable URLs
const renderTextWithLinks = (text: string) => {
  // More comprehensive URL regex
  const urlRegex = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)|(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gi;

  // Split text by URLs
  const parts = text.split(urlRegex).filter(Boolean);

  return parts.map((part, index) => {
    // Check if part is a URL
    if (part.match(urlRegex)) {
      // Ensure URL has protocol
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-400 underline"
        >
          {part}
        </a>
      );
    }
    // Otherwise render as plain text
    return part;
  });
};

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    // Handle different date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If the date is invalid, return the original string
      return dateString;
    }
    // Format as DD/MM/YYYY
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch (error) {
    // If there's an error parsing the date, return the original string
    return dateString;
  }
};

// Comment interface
interface CommunityComment {
  id: string;
  post_id: string;
  employee_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_avatar?: string;
  author_email: string;
  author_username?: string;
}

// Corporate news interface
interface CorporateNewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
}



// Corporate news
const corporateNews: CorporateNewsItem[] = [
  { id: "1", title: "Q2 Platform Announcement", summary: "Company announces platform launch with exciting new features!", date: "2026-01-01" },
  { id: "2", title: "Office Relocation Announcement", summary: "We're moving! Bigger space, brighter ideas, same amazing team", date: "2026-12-10" },
  { id: "3", title: "Employee Recognition Program", summary: "Nominations now open for quarterly awards", date: "2026-01-01" },
];

export default function CommunityArea() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { posts, loading, error, fetchPosts, createPost, likePost, bookmarkPost, repostPost, deletePost, createComment, getCommentsForPost, deleteComment } = useCommunity(authToken);
  const [newPost, setNewPost] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentType, setAttachmentType] = useState<"image" | "video" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [autoplayedVideos, setAutoplayedVideos] = useState<Set<string>>(new Set()); // Track autoplayed videos
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false); // New state for image upload status
  const [isVideoUploading, setIsVideoUploading] = useState(false); // New state for video upload status
  const [placeholderText, setPlaceholderText] = useState("What's happening?"); // New state for placeholder text
  const [displayedText, setDisplayedText] = useState(""); // State for typewriter effect
  const [currentIndex, setCurrentIndex] = useState(0); // Current character index for typewriter
  const [isDeleting, setIsDeleting] = useState(false); // State to track if we're deleting text
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // Current placeholder text index
  const [executiveStatus, setExecutiveStatus] = useState<Record<string, boolean>>({}); // State to track executive status for users
  const [commentModalOpen, setCommentModalOpen] = useState(false); // State for comment modal
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // State for selected post for comments
  const [comments, setComments] = useState<CommunityComment[]>([]); // State for comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [commentsLoading, setCommentsLoading] = useState(false); // State for comments loading
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Placeholder text options
  const placeholderOptions = [
    "What's happening?",
    "Share your thoughts...",
    "What's on your mind?",
    "Tell us something...",
    "How are you feeling?",
    "What's new with you?",
    "Share your story...",
    "What's exciting you?",
    "Tell us about your day...",
    "What are you working on?"
  ];

  // Check if user is executive
  const checkExecutiveStatus = async (username: string) => {
    // Return early if we already have the status cached
    if (executiveStatus.hasOwnProperty(username)) {
      return executiveStatus[username];
    }

    try {
      // This is a public endpoint that doesn't require authentication
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/hq/executive/status/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const isExecutive = data.data?.isExecutive || false;

        // Update the executive status cache
        setExecutiveStatus(prev => ({
          ...prev,
          [username]: isExecutive
        }));

        return isExecutive;
      }
    } catch (error) {
      console.error('Failed to check executive status:', error);
    }

    return false;
  };

  // Typewriter effect
  useEffect(() => {
    const currentPlaceholder = placeholderOptions[currentTextIndex];

    if (isDeleting) {
      // Deleting text
      if (currentIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentPlaceholder.substring(0, currentIndex - 1));
          setCurrentIndex(prev => prev - 1);
        }, 30); // Speed of deletion (increased from 50ms to 30ms)

        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        const nextIndex = (currentTextIndex + 1) % placeholderOptions.length;
        setCurrentTextIndex(nextIndex);
        setCurrentIndex(0);
      }
    } else {
      // Typing text
      if (currentIndex < currentPlaceholder.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentPlaceholder.substring(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        }, 50); // Speed of typing (decreased from 100ms to 50ms)

        return () => clearTimeout(timeout);
      } else {
        // Finished typing, wait then start deleting
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1000); // Pause before deleting (decreased from 2000ms to 1000ms)

        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, isDeleting, currentTextIndex, placeholderOptions]);

  // Fetch auth token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Try to get token from localStorage (similar to GroupInfo.tsx)
        let accessToken = null;

        // First try the standard key
        if (typeof window !== 'undefined') {
          accessToken = localStorage.getItem('access_token');

          // If not found, try alternative keys
          if (!accessToken) {
            const keys = Object.keys(localStorage);
            for (let key of keys) {
              if (key.toLowerCase().includes('access') && key.toLowerCase().includes('token')) {
                accessToken = localStorage.getItem(key);
                break;
              }
            }
          }
        }

        if (accessToken) {
          setAuthToken(accessToken);
        } else {
          console.error('No access token found in localStorage');
        }
      } catch (error) {
        console.error('Failed to fetch auth token:', error);
      }
    };

    fetchToken();
  }, []);

  // Fetch posts when authToken is available
  useEffect(() => {
    if (authToken) {
      const loadPosts = async () => {
        try {
          await fetchPosts();
          setIsLoading(false);
        } catch (err) {
          console.error('Failed to load posts:', err);
          setIsLoading(false);
        }
      };

      loadPosts();
    }
  }, [authToken, fetchPosts]);

  // Check executive status for post authors
  useEffect(() => {
    if (authToken && posts.length > 0) {
      posts.forEach(post => {
        if (post.author_username && !executiveStatus.hasOwnProperty(post.author_username)) {
          checkExecutiveStatus(post.author_username);
        }
      });
    }
  }, [authToken, posts, executiveStatus]);

  // Initialize all videos as muted
  useEffect(() => {
    const newMutedSet = new Set<string>();
    posts.forEach((post: any) => {
      if (post.video_url) {
        newMutedSet.add(post.id);
      }
    });
    setMutedVideos(newMutedSet);

    // Clear autoplayed videos when posts change
    setAutoplayedVideos(new Set());
  }, [posts]);

  // Add a new state to track manually paused videos
  const [manuallyPausedVideos, setManuallyPausedVideos] = useState<Set<string>>(new Set());

  // Handle video visibility for autoplay
  useEffect(() => {
    const handleScroll = () => {
      // Track if any video is currently playing due to autoplay
      let autoplayVideoPlaying = false;

      Object.keys(videoRefs.current).forEach((postId) => {
        const video = videoRefs.current[postId];
        if (video) {
          const rect = video.getBoundingClientRect();
          const isVisible = rect.top >= -100 && rect.bottom <= window.innerHeight + 100;

          // Skip videos that have been manually paused by the user
          if (manuallyPausedVideos.has(postId)) {
            return;
          }

          if (isVisible) {
            // If a video is already playing due to user interaction, don't autoplay others
            if (!autoplayVideoPlaying && autoplayedVideos.size === 0 && !playingVideos.has(postId)) {
              // Play video when in view only if no other video is playing and it's not manually paused
              video.play().catch(e => {
                console.log("Autoplay prevented:", e);
                // Update UI to show play button
                setPlayingVideos(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(postId);
                  return newSet;
                });
                setAutoplayedVideos(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(postId);
                  return newSet;
                });
              }).then(() => {
                // Update state to hide play button
                setPlayingVideos(prev => {
                  const newSet = new Set(prev);
                  newSet.add(postId);
                  return newSet;
                });
                setAutoplayedVideos(prev => {
                  const newSet = new Set(prev);
                  newSet.add(postId);
                  return newSet;
                });
                autoplayVideoPlaying = true;
              });
            } else if (!playingVideos.has(postId) && autoplayedVideos.has(postId)) {
              // Only pause videos that were autoplayed, not manually played videos
              video.pause();
              // Update state to show play button
              setPlayingVideos(prev => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
              });
            }
          } else {
            // Pause video when out of view
            if (autoplayedVideos.has(postId)) {
              video.pause();
              // Update state to show play button
              setPlayingVideos(prev => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
              });
              // Remove from autoplayed set when out of view
              setAutoplayedVideos(prev => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
              });
            }
          }
        }
      });
    };

    // Also check visibility on initial load
    setTimeout(handleScroll, 1000);

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, [posts, playingVideos, autoplayedVideos, manuallyPausedVideos]);

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleRepost = async (postId: string) => {
    try {
      await repostPost(postId);
    } catch (error) {
      console.error('Failed to repost post:', error);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      await bookmarkPost(postId);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setOpenDropdown(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVideoClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 650MB)
      if (file.size > 650 * 1024 * 1024) {
        console.error('File size exceeds maximum limit of 650MB');
        alert('File size exceeds maximum limit of 650MB');
        return;
      }

      try {
        setIsImageUploading(true); // Set image uploading state to true

        // Generate upload URL
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/upload-url`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            size: file.size,
          }),
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to generate upload URL');
        }

        const uploadData = await uploadResponse.json();
        const { uploadUrl, fileUrl } = uploadData.data;

        // Upload file to S3
        const s3Response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!s3Response.ok) {
          throw new Error('Failed to upload file to S3');
        }

        // Set the uploaded file URL as attachment
        setAttachments([fileUrl]);
        setAttachmentType("image");
      } catch (error) {
        console.error('Failed to upload file:', error);
        // Fallback to placeholder if upload fails
        setAttachments(["/images/bg-image2.jpg"]);
      } finally {
        setIsImageUploading(false); // Set image uploading state to false
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 650MB)
      if (file.size > 650 * 1024 * 1024) {
        console.error('File size exceeds maximum limit of 650MB');
        alert('File size exceeds maximum limit of 650MB');
        return;
      }

      try {
        setIsVideoUploading(true); // Set video uploading state to true

        // Generate upload URL
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/community/upload-url`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            size: file.size,
          }),
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to generate upload URL');
        }

        const uploadData = await uploadResponse.json();
        const { uploadUrl, fileUrl } = uploadData.data;

        // Upload file to S3
        const s3Response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!s3Response.ok) {
          throw new Error('Failed to upload file to S3');
        }

        // Set the uploaded file URL as attachment
        setAttachments([fileUrl]);
        setAttachmentType("video");
      } catch (error) {
        console.error('Failed to upload file:', error);
        // Fallback to placeholder if upload fails
        setAttachments(["/images/bg-image2.jpg"]);
      } finally {
        setIsVideoUploading(false); // Set video uploading state to false
      }
    }

    // Reset file input
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleRemoveAttachments = () => {
    setAttachments([]);
    setAttachmentType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handlePostSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await createPost(
        newPost,
        attachmentType === "image" ? attachments[0] : undefined,
        attachmentType === "video" ? attachments[0] : undefined
      );

      setNewPost("");
      setAttachments([]);
      setAttachmentType(null);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  // Video ref callback
  const setVideoRef = (postId: string) => (el: HTMLVideoElement | null) => {
    videoRefs.current[postId] = el;
  };

  // Manual play/pause toggle
  const toggleVideoPlayback = (postId: string) => {
    const video = videoRefs.current[postId];
    if (video) {
      if (video.paused) {
        // Pause all other videos first
        Object.keys(videoRefs.current).forEach((id) => {
          const otherVideo = videoRefs.current[id];
          if (otherVideo && id !== postId) {
            otherVideo.pause();
            // Update state to show play button for paused videos
            setPlayingVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
            // Remove from autoplayed set when manually paused
            setAutoplayedVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
          }
        });

        // Play the selected video
        video.play().then(() => {
          setPlayingVideos(prev => {
            const newSet = new Set(prev);
            newSet.add(postId);
            return newSet;
          });
          // Add to autoplayed set to enable scroll-based pausing
          setAutoplayedVideos(prev => {
            const newSet = new Set(prev);
            newSet.add(postId);
            return newSet;
          });
          // Remove from manually paused set since user is now playing it
          setManuallyPausedVideos(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }).catch(e => console.log("Play failed:", e));
      } else {
        // Pause the video
        video.pause();
        setPlayingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        // Remove from autoplayed set so scroll handler won't affect it
        setAutoplayedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        // Add to manually paused set so scroll handler won't autoplay it
        setManuallyPausedVideos(prev => {
          const newSet = new Set(prev);
          newSet.add(postId);
          return newSet;
        });
      }
    }
  };

  // Toggle mute/unmute for videos
  const toggleVideoMute = (postId: string) => {
    const video = videoRefs.current[postId];
    if (video) {
      const newMutedState = !video.muted;
      video.muted = newMutedState;

      setMutedVideos(prev => {
        const newSet = new Set(prev);
        if (newMutedState) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    }
  };

  // Get current user's employee ID from localStorage
  const getCurrentUserEmployeeId = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          // The user data from auth has 'id' field, but posts have 'employee_id' field
          return parsedData.id || parsedData.employee_id;
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
    }
    return null;
  };

  // Get current user's avatar from localStorage
  const getCurrentUserAvatar = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          return parsedData.profile_image_url || "/profile/default.jpg";
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
    }
    return "/profile/default.jpg";
  };

  // Get current user's name from localStorage
  const getCurrentUserName = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          return parsedData.full_name || parsedData.name || "You";
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
    }
    return "You";
  };

  // Handle opening comment modal
  const handleOpenCommentModal = async (postId: string) => {
    setSelectedPostId(postId);
    setCommentModalOpen(true);
    setCommentsLoading(true);

    try {
      const fetchedComments = await getCommentsForPost(postId);
      setComments(fetchedComments);

      // Check executive status for all comment authors
      fetchedComments.forEach((comment: CommunityComment) => {
        if (comment.author_username && !executiveStatus.hasOwnProperty(comment.author_username)) {
          checkExecutiveStatus(comment.author_username);
        }
      });
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Handle closing comment modal
  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedPostId(null);
    setComments([]);
    setNewComment("");
  };

  // Handle submitting a new comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPostId) return;

    try {
      await createComment(selectedPostId, newComment);

      // Add the new comment to the local state
      const newCommentObj: CommunityComment = {
        id: Math.random().toString(36).substr(2, 9), // Temporary ID
        post_id: selectedPostId,
        employee_id: getCurrentUserEmployeeId() || "",
        content: newComment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_name: getCurrentUserName(),
        author_avatar: getCurrentUserAvatar(),
        author_email: "", // We don't have this in localStorage
        author_username: "" // We don't have this in localStorage
      };

      setComments(prev => [...prev, newCommentObj]);
      setNewComment("");
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);

      // Remove the comment from the local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    }
  };

  // Filter and sort posts based on search query
  const filteredAndSortedPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    const matchingPosts: typeof posts = [];
    const nonMatchingPosts: typeof posts = [];

    // Separate posts that match the search query
    posts.forEach(post => {
      if (post.author_name.toLowerCase().includes(query) ||
        post.author_username?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)) {
        matchingPosts.push(post);
      } else {
        nonMatchingPosts.push(post);
      }
    });

    // Return matching posts first, then non-matching posts
    return [...matchingPosts, ...nonMatchingPosts];
  }, [posts, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex w-full h-full bg-black text-white overflow-hidden relative">
      {/* Loading overlay */}
      {(isLoading || loading) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="iphone-spinner scale-100" style={{ color: '#fff' }} aria-label="Loading" role="status">
            <div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {commentModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="bg-[#0a0a0a] rounded-xl border border-[#1f1f1f] w-[500px] h-[500px] flex flex-col"
            style={{
              boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)"
            }}
          >
            {/* Modal header */}
            <div className="p-2 border-b border-[#1f1f1f] flex items-center justify-between">
              <h3 className="text-lg font-bold">Comments</h3>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#1a1a1a] hover:text-red-600"
                onClick={handleCloseCommentModal}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Comments list */}
            <ScrollArea className="flex-1 p-4 w-full" style={{ maxHeight: '370px' }}>
              {commentsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="iphone-spinner scale-75" style={{ color: '#fff' }} aria-label="Loading" role="status">
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                    <div></div><div></div><div></div><div></div><div></div><div></div>
                  </div>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-4 pr-2">
                  {comments.map((comment: CommunityComment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={comment.author_avatar || "/profile/default.jpg"} alt={comment.author_name} />
                        <AvatarFallback className="bg-black border-1 border-white/20 text-white text-xs">
                          {comment.author_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="bg-[#0a0a0a] border-1 border-white/4 rounded-lg p-2 text-white">
                          <div className="flex items-center space-x-2 w-full">
                            <span className="font-semibold text-white text-sm truncate">{comment.author_name}</span>
                            {comment.author_username && executiveStatus[comment.author_username] && (
                              <div className="relative group flex-shrink-0">
                                <Image
                                  src="/special/executive.svg"
                                  alt="Verified"
                                  width={14}
                                  height={14}
                                  className="ml-1 relative top-0.5"
                                />
                              </div>
                            )}
                            {comment.author_username && (
                              <span className="text-gray-500 text-xs truncate">@{comment.author_username}</span>
                            )}
                            {comment.employee_id === getCurrentUserEmployeeId() && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full hover:bg-[#1a1a1a] hover:text-red-500 ml-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteComment(comment.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {formatDate(comment.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Comment input */}
            <div className="p-4 border-t border-[#1f1f1f]">
              <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getCurrentUserAvatar()} alt={getCurrentUserName()} />
                  <AvatarFallback className="bg-black border-1 border-white/20 text-white text-xs">
                    {getCurrentUserName().charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    ref={commentInputRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-500 rounded-full focus-visible:ring-1 focus-visible:ring-[#2a2a2a]"
                  />
                  <Button
                    type="submit"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-8"
                    disabled={!newComment.trim()}
                  >
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 border-r border-[#1f1f1f] min-h-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1f1f1f] flex items-center justify-between sticky top-0 bg-black z-10"
          style={{
            boxShadow: "0 4px 12px rgba(255, 255, 255, 0.05)"
          }}>
          <h1 className="text-xl font-semibold" style={{
            textShadow: "0 0 8px rgba(255, 255, 255, 0.3)"
          }}>Community</h1>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 opacity-50 pointer-events-none"
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
                }}
                disabled
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-white text-black text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Inactive
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
              </div>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 opacity-50 pointer-events-none"
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
                }}
                disabled
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-white text-black text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Inactive
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Scroll Area for Post Creation and Feed */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full h-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #111' }}>
          {/* Post creation area */}
          <div className="p-4 md:p-6">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getCurrentUserAvatar()} alt="Your profile" />
                <AvatarFallback className="bg-black border-1 border-white/20 text-white">
                  {getCurrentUserName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col space-y-3 w-full">
                  <div className="relative w-full">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder={displayedText}
                      className="w-full bg-transparent border-none text-white placeholder:text-gray-500 text-sm focus-visible:ring-0 p-0 resize-none min-h-[60px] outline-none"
                      style={{
                        background: 'transparent',
                        color: 'white'
                      }}
                    />
                    {/* Preview overlay for links - only shown when there are URLs */}
                    {newPost && (
                      <div className="absolute inset-0 pointer-events-none flex items-end">
                        <div className="flex-1 bg-transparent text-white text-sm resize-none min-h-[60px] outline-none opacity-0">
                          {newPost}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-end pt-2 border-t border-white/5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <input
                      type="file"
                      ref={videoInputRef}
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-transparent border-2 border-white/10 text-white hover:bg-white/10 cursor-pointer hover:text-white h-8 w-8 flex-shrink-0"
                      onClick={handleImageClick}
                      disabled={attachments.length >= 1 || isImageUploading || isVideoUploading}
                    >
                      {isImageUploading ? (
                        <div className="iphone-spinner scale-75" style={{ color: '#fff' }} aria-label="Uploading" role="status">
                          <div></div><div></div><div></div><div></div><div></div><div></div>
                          <div></div><div></div><div></div><div></div><div></div><div></div>
                        </div>
                      ) : (
                        <ImageIcon size={16} />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-transparent border-2 border-white/10 text-white hover:bg-white/10 cursor-pointer hover:text-white h-8 w-8 flex-shrink-0"
                      onClick={handleVideoClick}
                      disabled={attachments.length >= 1 || isVideoUploading || isImageUploading}
                    >
                      {isVideoUploading ? (
                        <div className="iphone-spinner scale-75" style={{ color: '#fff' }} aria-label="Uploading" role="status">
                          <div></div><div></div><div></div><div></div><div></div><div></div>
                          <div></div><div></div><div></div><div></div><div></div><div></div>
                        </div>
                      ) : (
                        <Play size={16} />
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePostSubmit}
                      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-8 w-16 p-0 cursor-pointer font-semibold transition-all duration-300 flex-shrink-0"
                      disabled={!newPost.trim() || isImageUploading || isVideoUploading}
                      style={{
                        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      Post
                    </Button>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {attachments.length > 0 && (
                    <div className="flex items-center bg-blue-500/20 rounded-full px-3 py-1">
                      <Paperclip size={14} className="text-blue-400 mr-1" />
                      <span className="text-blue-400 text-xs">Attachment</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 rounded-full hover:bg-blue-500/30 hover:text-white"
                        onClick={handleRemoveAttachments}
                      >
                        <X size={10} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Posts feed */}
          <div className="divide-y divide-[#1f1f1f] divide-dashed pb-20 md:pb-0">
            {filteredAndSortedPosts.map((post: typeof posts[0]) => {
              const currentUserEmployeeId = getCurrentUserEmployeeId();
              const isPostOwner = post.employee_id === currentUserEmployeeId;

              return (
                <div key={post.id} className="p-4 md:p-6 hover:bg-transparent transition-colors duration-200">
                  <div className="grid grid-cols-[40px_1fr] gap-x-3 gap-y-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author_avatar || "/profile/default.jpg"} alt={post.author_name} />
                      <AvatarFallback className="bg-black border-1 border-white/20 text-white">{post.author_name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex items-center justify-between min-w-0 col-start-2">
                      <div className="truncate pr-2">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold truncate">{post.author_name}</span>
                          {post.author_username && executiveStatus[post.author_username] && (
                            <div className="relative group flex-shrink-0">
                              <Image
                                src="/special/executive.svg"
                                alt="Verified"
                                width={16}
                                height={16}
                                className="ml-1 relative top-0.5"
                              />
                            </div>
                          )}
                        </div>
                        <span className="text-gray-500 text-[14px] truncate block">{post.author_username ? `@${post.author_username}` : post.author_email} · {formatDate(post.created_at)}</span>
                      </div>
                      {isPostOwner && (
                        <DropdownMenu open={openDropdown === post.id} onOpenChange={(isOpen) => setOpenDropdown(isOpen ? post.id : null)}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-[#1a1a1a] hover:text-blue-400 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === post.id ? null : post.id);
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-black border-[#1f1f1f]">
                            <DropdownMenuItem
                              className="text-red-500 hover:bg-[#1a1a1a] hover:text-red-400 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(post.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div className="col-span-2 md:col-span-1 md:col-start-2 space-y-2 min-w-0 pt-1">
                      <p className="text-[15px] leading-normal break-words">{renderTextWithLinks(post.content)}</p>

                      {post.image_url && (
                        <div className="mt-3 mb-2 rounded-xl overflow-hidden relative">
                          <img
                            src={post.image_url}
                            alt="Post attachment"
                            className="w-full h-auto object-contain max-h-[500px]"
                            style={{
                              boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                            }}
                          />
                          <div className="absolute inset-0 pointer-events-none" style={{
                            boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.15)",
                            borderRadius: "inherit"
                          }}></div>
                        </div>
                      )}

                      {post.video_url && (
                        <div className="mt-3 mb-2 rounded-xl overflow-hidden relative">
                          <video
                            ref={setVideoRef(post.id)}
                            src={post.video_url}
                            className="w-full h-auto object-contain max-h-[500px]"
                            style={{
                              boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                            }}
                            muted={mutedVideos.has(post.id)}
                            loop
                            playsInline
                            onClick={() => toggleVideoPlayback(post.id)}
                          />
                          <div className="absolute inset-0 pointer-events-none" style={{
                            boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.15)",
                            borderRadius: "inherit"
                          }}></div>
                          {!playingVideos.has(post.id) && (
                            <div
                              className="absolute inset-0 flex items-center justify-center cursor-pointer"
                              onClick={() => toggleVideoPlayback(post.id)}
                            >
                              <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm hover:bg-black/70 transition-colors">
                                <Play className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          )}
                          {/* Speaker icon in bottom right */}
                          <div
                            className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2 backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideoMute(post.id);
                            }}
                          >
                            {mutedVideos.has(post.id) ? (
                              <VolumeX className="w-4 h-4 text-white" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 p-2 w-full text-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white bg-transparent border-1 border-white/10 hover:text-text-white hover:bg-transparent rounded-full flex items-center space-x-1 px-2 flex-1 justify-center mr-4 md:mr-20 cursor-pointer"
                          onClick={() => handleOpenCommentModal(post.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments_count}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-white bg-transparent border-1 border-white/10 hover:text-text-white hover:bg-transparent rounded-full flex items-center space-x-1 px-2 flex-1 justify-center cursor-pointer ${post.isLiked ? 'text-white' : 'text-red-600'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                        >
                          <Heart className="h-4 w-4" />
                          <span>{post.likes_count}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right sidebar */}
      <div className="w-[350px] border-l border-[#1f1f1f] p-4 hidden lg:block overflow-y-auto relative" style={{ maxHeight: 'calc(100vh - 20px)' }}>
        {/* Overlay for Inactive State */}
        <div className="absolute inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center rounded-lg">
          <span className="text-white font-semibold text-sm px-4 py-2 rounded-lg bg-transparent">Inactive until 18 March, 2026</span>
        </div>

        {/* Search */}
        <div className="relative mb-6 opacity-50 pointer-events-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search posts by name..."
            className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 placeholder:text-gray-600 rounded-full focus-visible:ring-1 focus-visible:ring-[#2a2a2a]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Corporate News */}
        <div className="bg-[#0a0a0a] rounded-xl mb-6 opacity-50 pointer-events-none" style={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" }}>
          <h2 className="text-xl font-bold p-4" style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.3)" }}>Corporate News</h2>
          <div className="divide-y divide-[#1f1f1f]">
            {corporateNews.map((news) => (
              <div key={news.id} className="p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{news.title}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{news.summary}</p>
                    <p className="text-gray-500 text-xs mt-2">{formatDate(news.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 relative group">
            <Button
              variant="link"
              className="text-blue-500 p-0 h-auto pointer-events-none opacity-50"
              disabled
            >
              View all news
            </Button>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-[#0a0a0a] rounded-xl opacity-50 pointer-events-none" style={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" }}>
          <h2 className="text-xl font-bold p-4" style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.3)" }}>Community Guidelines</h2>
          <div className="p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">Be respectful and professional in all interactions</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">Share relevant and appropriate content only</p>
            </div>
          </div>
          <div className="p-4 relative group">
            <Button
              variant="link"
              className="text-blue-500 p-0 h-auto pointer-events-none opacity-50"
              disabled
            >
              Read full guidelines
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
}