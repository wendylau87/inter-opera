// frontend/pages/index.test.js
import { render, screen, waitFor } from "@testing-library/react";
import Home from "./index";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: 1, name: "John Doe", deals: [] }]),
  })
);

describe("Home Page", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders loading state initially", () => {
    render(<Home />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders sales representatives after fetching data", async () => {
    render(<Home />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it("handles fetch error", async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch error")));
    render(<Home />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/error: fetch error/i)).toBeInTheDocument();
  });
});