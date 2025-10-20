import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SignupForm } from "../signup-form";

// Mock the auth action
vi.mock("@/actions/auth-actions", () => ({
	signup: vi.fn(),
}));

// Mock shadcn components
vi.mock("@/components/ui/alert", () => ({
	Alert: ({ children, variant }: any) => <div data-variant={variant}>{children}</div>,
	AlertDescription: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
	Button: ({ children, disabled, type, className }: any) => (
		<button type={type} disabled={disabled} className={className}>
			{children}
		</button>
	),
}));

vi.mock("@/components/ui/input", () => ({
	Input: (props: any) => <input {...props} />,
}));

vi.mock("@/components/ui/label", () => ({
	Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));

// Mock useActionState hook
const mockUseActionState = vi.fn();
vi.mock("react", async () => {
	const actual = await vi.importActual("react");
	return {
		...actual,
		useActionState: (...args: any[]) => mockUseActionState(...args),
	};
});

describe("SignupForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseActionState.mockReturnValue([{}, vi.fn(), false]);
	});

	it("should render signup form with all required fields", () => {
		render(<SignupForm />);

		expect(screen.getByRole("heading", { name: "Create Account" })).toBeInTheDocument();
		expect(screen.getByText("Join the Veromodels collector community")).toBeInTheDocument();
		expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
	});

	it("should display all input fields with correct attributes", () => {
		render(<SignupForm />);

		const nameInput = screen.getByPlaceholderText("John Doe");
		const emailInput = screen.getByPlaceholderText("your@email.com");
		const passwordInput = screen.getByPlaceholderText("Minimum 8 characters");
		const confirmPasswordInput = screen.getByPlaceholderText("Re-enter your password");

		// Name input
		expect(nameInput).toHaveAttribute("type", "text");
		expect(nameInput).toHaveAttribute("name", "name");
		expect(nameInput).toBeRequired();

		// Email input
		expect(emailInput).toHaveAttribute("type", "email");
		expect(emailInput).toHaveAttribute("name", "email");
		expect(emailInput).toBeRequired();

		// Password input
		expect(passwordInput).toHaveAttribute("type", "password");
		expect(passwordInput).toHaveAttribute("name", "password");
		expect(passwordInput).toHaveAttribute("minlength", "8");
		expect(passwordInput).toBeRequired();

		// Confirm password input
		expect(confirmPasswordInput).toHaveAttribute("type", "password");
		expect(confirmPasswordInput).toHaveAttribute("name", "confirmPassword");
		expect(confirmPasswordInput).toHaveAttribute("minlength", "8");
		expect(confirmPasswordInput).toBeRequired();
	});

	it("should display password requirements hint", () => {
		render(<SignupForm />);

		expect(screen.getByText("Must be at least 8 characters long")).toBeInTheDocument();
	});

	it("should show error message when signup fails", () => {
		mockUseActionState.mockReturnValue([{ error: "Email already registered" }, vi.fn(), false]);

		render(<SignupForm />);

		expect(screen.getByText("Email already registered")).toBeInTheDocument();
	});

	it('should show "Creating Account..." when form is pending', () => {
		mockUseActionState.mockReturnValue([{}, vi.fn(), true]);

		render(<SignupForm />);

		expect(screen.getByRole("button", { name: "Creating Account..." })).toBeInTheDocument();
	});

	it("should disable all inputs when form is pending", () => {
		mockUseActionState.mockReturnValue([{}, vi.fn(), true]);

		render(<SignupForm />);

		const nameInput = screen.getByPlaceholderText("John Doe");
		const emailInput = screen.getByPlaceholderText("your@email.com");
		const passwordInput = screen.getByPlaceholderText("Minimum 8 characters");
		const confirmPasswordInput = screen.getByPlaceholderText("Re-enter your password");
		const submitButton = screen.getByRole("button", { name: "Creating Account..." });

		expect(nameInput).toBeDisabled();
		expect(emailInput).toBeDisabled();
		expect(passwordInput).toBeDisabled();
		expect(confirmPasswordInput).toBeDisabled();
		expect(submitButton).toBeDisabled();
	});

	it("should display sign in link for existing users", () => {
		render(<SignupForm />);

		const signinButton = screen.getByRole("link", { name: "Sign In" });
		expect(signinButton).toBeInTheDocument();
		expect(signinButton).toHaveAttribute("href", "/login");
	});

	it("should display terms and privacy policy links", () => {
		render(<SignupForm />);

		const termsLink = screen.getByRole("link", { name: /Terms of Service/i });
		const privacyLink = screen.getByRole("link", { name: /Privacy Policy/i });

		expect(termsLink).toHaveAttribute("href", "/terms");
		expect(privacyLink).toHaveAttribute("href", "/privacy");
	});

	it("should apply Vero design system classes", () => {
		const { container } = render(<SignupForm />);

		const card = container.querySelector(".vero-glass-card");
		const button = container.querySelector(".vero-button");
		const inputs = container.querySelectorAll(".vero-input");

		expect(card).toBeInTheDocument();
		expect(button).toBeInTheDocument();
		expect(inputs.length).toBeGreaterThan(0);
	});

	it("should accept custom className prop", () => {
		const { container } = render(<SignupForm className="custom-signup-class" />);

		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass("custom-signup-class");
	});

	it("should have correct form structure", () => {
		render(<SignupForm />);

		const form = screen.getByRole("button", { name: "Create Account" }).closest("form");
		expect(form).toBeInTheDocument();
	});

	it("should display proper visual hierarchy", () => {
		render(<SignupForm />);

		// Check for heading
		const heading = screen.getByRole("heading", { name: "Create Account" });
		expect(heading).toBeInTheDocument();

		// Check for subtitle
		const subtitle = screen.getByText("Join the Veromodels collector community");
		expect(subtitle).toBeInTheDocument();

		// Check for divider text
		expect(screen.getByText("Already a member?")).toBeInTheDocument();
	});
});
