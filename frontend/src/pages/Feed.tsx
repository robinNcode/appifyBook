import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPosts } from "../api/services";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import Post from "../component/Post";
import type { Post as PostType } from "../types";

export default function Feed() {
    return (
        <div>
            <h1>Feed</h1>
        </div>
    );
}