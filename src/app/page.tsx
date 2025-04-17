import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="p-4">
      <Link href="/crop" className="block mb-4 text-blue-500 hover:underline">
        Crop Image
      </Link>
      <Link href="/resize" className="block mb-4 text-blue-500 hover:underline">
        Resize Image
      </Link>
      <Link href="/background-removal" className="block mb-4 text-blue-500 hover:underline">
        Background Removal
      </Link>
      <Link href="/blur" className="block mb-4 text-blue-500 hover:underline">
        Freehand Blur Tool
      </Link>
      <Link href="/hard-compressor" className="block mb-4 text-blue-500 hover:underline">
        Hard Compressor
      </Link>
      <Link href="/github-readme-profile" className="block mb-4 text-blue-500 hover:underline">
        Profile Generator
      </Link>
    </div>
  );
};

export default Home;
