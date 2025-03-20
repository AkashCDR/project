import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="p-4">
      <Link href="/crop" className="mr-4 text-blue-500 hover:underline">
        Crop Image
      </Link>
      <Link href="/resize" className="text-blue-500 hover:underline">
        Resize Image
      </Link>
    </div>
  );
};

export default Home;
