"use client"

import Link from "next/link"
import { Ticket } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <Ticket className="w-6 h-6" />
              TicketHub
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              Your trusted platform to find and buy live event tickets.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Events</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Music
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Theater
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  View all
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground transition">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-primary-foreground/70">© 2025 TicketHub. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
              Twitter
            </Link>
            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
              Facebook
            </Link>
            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
