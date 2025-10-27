"use client";

import { useState } from "react";
import { User, Mail, Lock, Save, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Card } from "@/ui/shadcn/card";
import { toast } from "sonner";

interface ProfileSettingsProps {
	userEmail: string;
}

export function ProfileSettings({ userEmail }: ProfileSettingsProps) {
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	
	const [emailForm, setEmailForm] = useState({
		newEmail: userEmail,
		password: "",
	});
	
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleEmailUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		
		try {
			// TODO: Implement email update logic
			toast.success("Email updated successfully!");
			setIsEditingEmail(false);
		} catch (error) {
			toast.error("Failed to update email. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error("New passwords don't match");
			return;
		}
		
		if (passwordForm.newPassword.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}
		
		setIsLoading(true);
		
		try {
			// TODO: Implement password change logic
			toast.success("Password changed successfully!");
			setIsChangingPassword(false);
			setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
		} catch (error) {
			toast.error("Failed to change password. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Email Settings */}
			<Card className="bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center">
							<Mail className="w-5 h-5 text-[#dfbc3f]" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-white">Email Address</h3>
							<p className="text-gray-400 text-sm">Update your email address</p>
						</div>
					</div>
					{!isEditingEmail && (
						<Button
							onClick={() => setIsEditingEmail(true)}
							variant="outline"
							size="sm"
							className="border-[#dfbc3f]/30 text-[#dfbc3f] hover:bg-[#dfbc3f]/20"
						>
							<User className="w-4 h-4 mr-2" />
							Edit
						</Button>
					)}
				</div>

				{isEditingEmail ? (
					<form onSubmit={handleEmailUpdate} className="space-y-4">
						<div>
							<Label htmlFor="newEmail" className="text-white">New Email Address</Label>
							<Input
								id="newEmail"
								type="email"
								value={emailForm.newEmail}
								onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
								className="bg-white/5 border-[#dfbc3f]/30 text-white"
								required
							/>
						</div>
						<div>
							<Label htmlFor="emailPassword" className="text-white">Current Password</Label>
							<Input
								id="emailPassword"
								type="password"
								value={emailForm.password}
								onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
								className="bg-white/5 border-[#dfbc3f]/30 text-white"
								placeholder="Enter your current password"
								required
							/>
						</div>
						<div className="flex gap-2">
							<Button
								type="submit"
								disabled={isLoading}
								className="bg-[#dfbc3f] text-black hover:bg-[#c4a535]"
							>
								<Save className="w-4 h-4 mr-2" />
								{isLoading ? "Updating..." : "Update Email"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsEditingEmail(false);
									setEmailForm({ newEmail: userEmail, password: "" });
								}}
								className="border-gray-500 text-gray-400 hover:bg-gray-700"
							>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<div className="p-4 bg-white/5 rounded-lg border border-[#dfbc3f]/20">
						<p className="text-white font-medium">{userEmail}</p>
					</div>
				)}
			</Card>

			{/* Password Settings */}
			<Card className="bg-black/40 backdrop-blur-sm border border-[#dfbc3f]/30 p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-[#dfbc3f]/20 rounded-lg flex items-center justify-center">
							<Lock className="w-5 h-5 text-[#dfbc3f]" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-white">Password</h3>
							<p className="text-gray-400 text-sm">Change your account password</p>
						</div>
					</div>
					{!isChangingPassword && (
						<Button
							onClick={() => setIsChangingPassword(true)}
							variant="outline"
							size="sm"
							className="border-[#dfbc3f]/30 text-[#dfbc3f] hover:bg-[#dfbc3f]/20"
						>
							<Lock className="w-4 h-4 mr-2" />
							Change
						</Button>
					)}
				</div>

				{isChangingPassword ? (
					<form onSubmit={handlePasswordChange} className="space-y-4">
						<div>
							<Label htmlFor="currentPassword" className="text-white">Current Password</Label>
							<div className="relative">
								<Input
									id="currentPassword"
									type={showCurrentPassword ? "text" : "password"}
									value={passwordForm.currentPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
									className="bg-white/5 border-[#dfbc3f]/30 text-white pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
								>
									{showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>
						<div>
							<Label htmlFor="newPassword" className="text-white">New Password</Label>
							<div className="relative">
								<Input
									id="newPassword"
									type={showNewPassword ? "text" : "password"}
									value={passwordForm.newPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
									className="bg-white/5 border-[#dfbc3f]/30 text-white pr-10"
									minLength={6}
									required
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
								>
									{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>
						<div>
							<Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									value={passwordForm.confirmPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
									className="bg-white/5 border-[#dfbc3f]/30 text-white pr-10"
									minLength={6}
									required
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
								>
									{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								type="submit"
								disabled={isLoading}
								className="bg-[#dfbc3f] text-black hover:bg-[#c4a535]"
							>
								<Save className="w-4 h-4 mr-2" />
								{isLoading ? "Changing..." : "Change Password"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsChangingPassword(false);
									setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
								}}
								className="border-gray-500 text-gray-400 hover:bg-gray-700"
							>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<div className="p-4 bg-white/5 rounded-lg border border-[#dfbc3f]/20">
						<p className="text-white font-medium">••••••••••••</p>
						<p className="text-gray-400 text-sm mt-1">Password is hidden for security</p>
					</div>
				)}
			</Card>
		</div>
	);
}