import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Trans from "./Trans";

const html = (t: string, children = [<b />, <a href="https://example.com" />]) =>
  render(<Trans t={t}>{...children}</Trans>).container.innerHTML;

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

  it("renders plain strings without tags", () => {
    expect(html("just text")).toBe("just text");
  });

  it("renders with no children", () => {
    expect(render(<Trans t="hi" />).container.innerHTML).toBe("hi");
  });

  it("handles escaped brackets and non-numeric tags as text", () => {
    expect(html("a \\<1> <b> <1>x</1>")).toBe("a &lt;1&gt; &lt;b&gt; <b>x</b>");
  });

  it("supports self-closing tags", () => {
    expect(html("line<1/>break", [<br />])).toBe("line<br>break");
  });

  it("allows reusing the same element", () => {
    expect(html("<1>a</1> <1>b</1>")).toBe("<b>a</b> <b>b</b>");
  });

  it.each([
    ["unmatched closing tag", "oops</1>"],
    ["unclosed tag", "<1>oops"],
    ["mismatched tags", "<1><2>x</1></2>"],
    ["tag without element", "<3>x</3>"],
    ["tag zero", "<0>x</0>"],
  ])("falls back to the raw string on %s", (_, t) => {
    expect(render(<Trans t={t}><b /><i /></Trans>).container.textContent).toBe(t);
  });

  it("does not warn about missing keys", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    html("<1>a</1> and <2>b</2>");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
