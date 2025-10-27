import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth-actions";
import { User, Mail, Calendar, Settings } from "lucide-react";
import { ProfileSettings } from "./profile-settings";

export default async function ProfilePage() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
						<p className="text-gray-400">Manage your account settings and preferences</p>
					</div>

					{/* Profile Card */}
					<div className="bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg p-6 mb-6">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-16 h-16 bg-[#dfbc3f]/20 rounded-full flex items-center justify-center">
								<User className="w-8 h-8 text-[#dfbc3f]" />
							</div>
							<div>
								<h2 className="text-xl font-semibold text-white">Account Information</h2>
								<p className="text-gray-400">Your basic account details</p>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-[#dfbc3f]/20">
									<Mail className="w-5 h-5 text-[#dfbc3f]" />
									<div>
										<label className="text-sm text-gray-400">Email Address</label>
										<p className="text-white font-medium">{user.email}</p>
									</div>
								</div>

								<div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-[#dfbc3f]/20">
									<Calendar className="w-5 h-5 text-[#dfbc3f]" />
									<div>
										<label className="text-sm text-gray-400">Member Since</label>
										<p className="text-white font-medium">
											{new Date(user.created_at).toLocaleDateString()}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-[#dfbc3f]/20">
									<Settings className="w-5 h-5 text-[#dfbc3f]" />
									<div>
										<label className="text-sm text-gray-400">Account Status</label>
										<p className="text-green-400 font-medium">Active</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Account Settings */}
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-white mb-4">Account Settings</h2>
						<ProfileSettings userEmail={user.email || ""} />
					</div>

					{/* Quick Actions */}
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
							<a
								href="/orders"
								className="group p-6 bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center group-hover:bg-[#dfbc3f]/30 transition-colors">
										<svg className="w-5 h-5 text-[#dfbc3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
										</svg>
									</div>
									<h3 className="text-white font-semibold">My Orders</h3>
								</div>
								<p className="text-gray-400 text-sm">View your order history and track shipments</p>
							</a>

							<a
								href="/favorites"
								className="group p-6 bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center group-hover:bg-[#dfbc3f]/30 transition-colors">
										<svg className="w-5 h-5 text-[#dfbc3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
										</svg>
									</div>
									<h3 className="text-white font-semibold">Favorites</h3>
								</div>
								<p className="text-gray-400 text-sm">Manage your favorite products and wishlist</p>
							</a>

							<a
								href="/newsletter"
								className="group p-6 bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center group-hover:bg-[#dfbc3f]/30 transition-colors">
										<svg className="w-5 h-5 text-[#dfbc3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<h3 className="text-white font-semibold">Newsletter</h3>
								</div>
								<p className="text-gray-400 text-sm">Manage your newsletter preferences</p>
							</a>

							<a
								href="/cart"
								className="group p-6 bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center group-hover:bg-[#dfbc3f]/30 transition-colors">
										<svg className="w-5 h-5 text-[#dfbc3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
										</svg>
									</div>
									<h3 className="text-white font-semibold">Shopping Cart</h3>
								</div>
								<p className="text-gray-400 text-sm">View and manage items in your cart</p>
							</a>

							<a
								href="/contact"
								className="group p-6 bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center group-hover:bg-[#dfbc3f]/30 transition-colors">
										<svg className="w-5 h-5 text-[#dfbc3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
										</svg>
									</div>
									<h3 className="text-white font-semibold">Contact Support</h3>
								</div>
								<p className="text-gray-400 text-sm">Get help with your account or orders</p>
							</a>

							<a
								href="/privacy-policy"
								className="group p-6 bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f] transition-all duration-300"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center group-hover:bg-[#dfbc3f]/30 transition-colors">
										<svg className="w-5 h-5 text-[#dfbc3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
									</div>
									<h3 className="text-white font-semibold">Privacy & Security</h3>
								</div>
								<p className="text-gray-400 text-sm">Review our privacy policy and security practices</p>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}