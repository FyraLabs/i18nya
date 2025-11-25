import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Trans from "./Trans";

describe("<Trans />", () => {
  it("renders nested elements according to translation string", () => {
    const translation = "Hello <1>user</1>, welcome to <2><1>my site</1></2>.";
    render(
      <Trans t={translation}>
        <b />
        <a href="https://example.com" />
      </Trans>,
    );
    expect(screen.getByText("my site")).toBeInTheDocument();
    const bold = screen.getByText("user");
    expect(bold.tagName).toBe("B");
    const link = screen.getByText("my site").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
