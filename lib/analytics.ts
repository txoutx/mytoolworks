export type ToolEvent =
  | "tool_view"
  | "tool_input_started"
  | "tool_process_started"
  | "tool_process_completed"
  | "tool_download_clicked";

export type ToolEventPayload = {
  event: ToolEvent;
  toolRoute: string;
  categorySlug: string;
  processing: string;
};

export function trackToolEvent(payload: ToolEventPayload) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("mytoolworks:analytics", {
      detail: payload
    })
  );
}
