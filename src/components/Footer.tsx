"use client";

import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Kulineran. Semua Hak Dilindungi.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to="/about" className="hover:text-primary transition-colors">Tentang Kami</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;