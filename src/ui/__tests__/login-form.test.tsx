import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../login-form";

// Mock the auth action
vi.mock("@/actions/auth-actions", () => ({
	login: vi.fn(),
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

describe("LoginForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseActionState.mockReturnValue([{}, vi.fn(), false]);
	});

	it("should render login form with all fields", () => {
		render(<LoginForm />);

		expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument();
		expect(screen.getByText("Access your premium collection")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
	});

	it("should display email and password inputs with correct attributes", () => {
		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText("your@email.com");
		const passwordInput = screen.getByPlaceholderText("Enter your password");

		expect(emailInput).toHaveAttribute("type", "email");
		expect(emailInput).toHaveAttribute("name", "email");
		expect(emailInput).toBeRequired();

		expect(passwordInput).toHaveAttribute("type", "password");
		expect(passwordInput).toHaveAttribute("name", "password");
		expect(passwordInput).toBeRequired();
	});

	it("should show error message when authentication fails", () => {
		mockUseActionState.mockReturnValue([{ error: "Invalid email or password" }, vi.fn(), false]);

		render(<LoginForm />);

		expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
	});

	it('should show "Signing In..." when form is pending', () => {
		mockUseActionState.mockReturnValue([{}, vi.fn(), true]);

		render(<LoginForm />);

		expect(screen.getByRole("button", { name: "Signing In..." })).toBeInTheDocument();
	});

	it("should disable inputs when form is pending", () => {
		mockUseActionState.mockReturnValue([{}, vi.fn(), true]);

		render(<LoginForm />);

		const emailInput = screen.getByPlaceholderText("your@email.com");
		const passwordInput = screen.getByPlaceholderText("Enter your password");
		const submitButton = screen.getByRole("button");

		expect(emailInput).toBeDisabled();
		expect(passwordInput).toBeDisabled();
		expect(submitButton).toBeDisabled();
	});

	it("should display forgot password link", () => {
		render(<LoginForm />);

		const forgotLink = screen.getByText("Forgot password?");
		expect(forgotLink).toBeInTheDocument();
		expect(forgotLink).toHaveAttribute("href", "#");
	});

	it("should display create account link", () => {
		render(<LoginForm />);

		const signupButton = screen.getByRole("link", { name: "Create Account" });
		expect(signupButton).toBeInTheDocument();
		expect(signupButton).toHaveAttribute("href", "/signup");
	});

	it("should display terms and privacy links", () => {
		render(<LoginForm />);

		const termsLink = screen.getByRole("link", { name: /Terms of Service/i });
		const privacyLink = screen.getByRole("link", { name: /Privacy Policy/i });

		expect(termsLink).toHaveAttribute("href", "/terms");
		expect(privacyLink).toHaveAttribute("href", "/privacy");
	});

	it("should apply Vero design system classes", () => {
		const { container } = render(<LoginForm />);

		const card = container.querySelector(".vero-glass-card");
		const button = container.querySelector(".vero-button");
		const inputs = container.querySelectorAll(".vero-input");

		expect(card).toBeInTheDocument();
		expect(button).toBeInTheDocument();
		expect(inputs.length).toBeGreaterThan(0);
	});

	it("should accept custom className prop", () => {
		const { container } = render(<LoginForm className="custom-class" />);

		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass("custom-class");
	});

	it("should use form action from useActionState", () => {
		const mockAction = vi.fn();
		mockUseActionState.mockReturnValue([{}, mockAction, false]);

		render(<LoginForm />);

		const form = screen.getByRole("button").closest("form");
		expect(form).toBeInTheDocument();
	});
});
