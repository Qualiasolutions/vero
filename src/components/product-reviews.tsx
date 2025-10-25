"use client";

import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Textarea } from "@/ui/shadcn/textarea";

interface Review {
	id: string;
	productId: string;
	customerName: string;
	rating: number;
	comment: string;
	date: string;
	helpful: number;
	notHelpful: number;
}

interface ProductReviewsProps {
	productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [newReview, setNewReview] = useState({
		customerName: "",
		rating: 5,
		comment: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasReviewed, setHasReviewed] = useState(false);

	// Load reviews from localStorage on mount
	useEffect(() => {
		const storedReviews = localStorage.getItem(`reviews_${productId}`);
		if (storedReviews) {
			setReviews(JSON.parse(storedReviews) as Review[]);
		}

		// Check if user has already reviewed this product
		const hasReviewedKey = `hasReviewed_${productId}`;
		const userHasReviewed = localStorage.getItem(hasReviewedKey);
		if (userHasReviewed) {
			setHasReviewed(true);
		}
	}, [productId]);

	// Save reviews to localStorage whenever they change
	useEffect(() => {
		if (reviews.length > 0) {
			localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
		}
	}, [reviews, productId]);

	const handleSubmitReview = async () => {
		if (!newReview.customerName.trim() || !newReview.comment.trim()) {
			return;
		}

		setIsSubmitting(true);

		// Create new review
		const review: Review = {
			id: Date.now().toString(),
			productId,
			customerName: newReview.customerName.trim(),
			rating: newReview.rating,
			comment: newReview.comment.trim(),
			date: new Date().toISOString(),
			helpful: 0,
			notHelpful: 0,
		};

		// Add review to state
		setReviews((prev) => [review, ...prev]);

		// Mark that user has reviewed
		localStorage.setItem(`hasReviewed_${productId}`, "true");
		setHasReviewed(true);

		// Reset form
		setNewReview({ customerName: "", rating: 5, comment: "" });
		setIsSubmitting(false);
	};

	const handleHelpful = (reviewId: string, isHelpful: boolean) => {
		const helpfulKey = `helpful_${reviewId}`;
		const hasVoted = localStorage.getItem(helpfulKey);

		if (hasVoted) return; // User already voted

		setReviews((prev) =>
			prev.map((review) => {
				if (review.id === reviewId) {
					return {
						...review,
						helpful: isHelpful ? review.helpful + 1 : review.helpful,
						notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful,
					};
				}
				return review;
			}),
		);

		localStorage.setItem(helpfulKey, "true");
	};

	const averageRating =
		reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

	const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
		rating,
		count: reviews.filter((r) => r.rating === rating).length,
	}));

	return (
		<div className="space-y-8">
			{/* Reviews Summary */}
			<div className="bg-gradient-to-r from-[var(--vero-gold-accent)]/5 to-[var(--vero-gold-accent)]/10 border border-[var(--vero-gold-accent)]/20 rounded-lg p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div className="text-center md:text-left">
						<h3 className="text-2xl font-bold text-[#111827] mb-2">Customer Reviews</h3>
						<div className="flex items-center gap-2 mb-2">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-5 h-5 ${
											i < Math.round(averageRating)
												? "fill-[var(--vero-gold-accent)] text-[var(--vero-gold-accent)]"
												: "fill-transparent text-gray-300"
										}`}
									/>
								))}
							</div>
							<span className="text-lg font-semibold text-[#111827]">{averageRating.toFixed(1)}</span>
							<span className="text-sm text-[#6B7280]">
								({reviews.length} review{reviews.length !== 1 ? "s" : ""})
							</span>
						</div>
					</div>

					{/* Rating Distribution */}
					<div className="flex-1 max-w-md">
						{ratingCounts.map(({ rating, count }) => {
							const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
							return (
								<div key={rating} className="flex items-center gap-2 mb-1">
									<span className="text-sm text-[#6B7280] w-8">{rating}★</span>
									<div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
										<div
											className="h-full bg-[var(--vero-gold-accent)] transition-all duration-500"
											style={{ width: `${percentage}%` }}
										/>
									</div>
									<span className="text-sm text-[#6B7280] w-8 text-right">{count}</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Add Review Form */}
			{!hasReviewed && (
				<div className="bg-white border border-gray-200 rounded-lg p-6">
					<h4 className="text-lg font-semibold text-[#111827] mb-4">Write a Review</h4>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[#111827] mb-2">Your Name</label>
							<input
								type="text"
								value={newReview.customerName}
								onChange={(e) => setNewReview((prev) => ({ ...prev, customerName: e.target.value }))}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--vero-gold-accent)]/30"
								placeholder="Enter your name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-[#111827] mb-2">Rating</label>
							<div className="flex items-center gap-2">
								{[...Array(5)].map((_, i) => (
									<button
										key={i}
										type="button"
										onClick={() => setNewReview((prev) => ({ ...prev, rating: i + 1 }))}
										className="transition-transform hover:scale-110"
									>
										<Star
											className={`w-6 h-6 ${
												i < newReview.rating
													? "fill-[var(--vero-gold-accent)] text-[var(--vero-gold-accent)]"
													: "fill-transparent text-gray-300 hover:text-[var(--vero-gold-accent)]"
											}`}
										/>
									</button>
								))}
								<span className="text-sm text-[#6B7280] ml-2">{newReview.rating} out of 5</span>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-[#111827] mb-2">Your Review</label>
							<Textarea
								value={newReview.comment}
								onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
								placeholder="Share your thoughts about this product..."
								className="min-h-[100px]"
							/>
						</div>

						<Button
							onClick={handleSubmitReview}
							disabled={isSubmitting || !newReview.customerName.trim() || !newReview.comment.trim()}
							className="bg-[var(--vero-gold-accent)] hover:bg-[#A89050] text-white"
						>
							{isSubmitting ? "Submitting..." : "Submit Review"}
						</Button>
					</div>
				</div>
			)}

			{hasReviewed && (
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<p className="text-sm text-green-800">✓ Thank you! You have already reviewed this product.</p>
				</div>
			)}

			{/* Reviews List */}
			<div className="space-y-6">
				{reviews.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-[#6B7280]">No reviews yet. Be the first to review this product!</p>
					</div>
				) : (
					reviews.map((review) => (
						<div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
							<div className="flex items-start justify-between mb-4">
								<div>
									<div className="flex items-center gap-2 mb-2">
										<h5 className="font-semibold text-[#111827]">{review.customerName}</h5>
										<div className="flex items-center">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`w-4 h-4 ${
														i < review.rating
															? "fill-[var(--vero-gold-accent)] text-[var(--vero-gold-accent)]"
															: "fill-transparent text-gray-300"
													}`}
												/>
											))}
										</div>
									</div>
									<p className="text-sm text-[#6B7280]">
										{new Date(review.date).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
								<Badge variant="secondary" className="text-xs">
									Verified Purchase
								</Badge>
							</div>

							<p className="text-[#374151] leading-relaxed mb-4">{review.comment}</p>

							<div className="flex items-center gap-4 pt-4 border-t border-gray-100">
								<span className="text-sm text-[#6B7280]">Was this helpful?</span>
								<div className="flex items-center gap-2">
									<button
										onClick={() => handleHelpful(review.id, true)}
										className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[var(--vero-gold-accent)] transition-colors"
									>
										<ThumbsUp className="w-4 h-4" />
										<span>{review.helpful}</span>
									</button>
									<button
										onClick={() => handleHelpful(review.id, false)}
										className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[var(--vero-gold-accent)] transition-colors"
									>
										<ThumbsDown className="w-4 h-4" />
										<span>{review.notHelpful}</span>
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
