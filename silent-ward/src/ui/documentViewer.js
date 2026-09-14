export function createDocumentViewer({
  onOpen,
  onClose,
} = {}) {

  const overlay =
    document.createElement("div");

  overlay.id =
    "document-viewer";


  overlay.innerHTML = `
    <div class="document-container">

      <button
        id="document-close"
        class="document-close"
      >
        ×
      </button>

      <div class="document-paper">

        <div class="document-header">
          <div>ABANDONED HOSPITAL</div>
          <div>WARD C</div>
        </div>

        <hr />

        <h1>Patient File</h1>

        <div class="document-meta">
          <p><strong>Patient:</strong> Unknown</p>
          <p><strong>Status:</strong> TRANSFERRED</p>
          <p><strong>Ward:</strong> C</p>
        </div>

        <p>
          Patient repeatedly reports hearing footsteps
          in the corridor during the night.
        </p>

        <p>
          Staff initially dismissed the reports as
          hallucinations.
        </p>

        <p>
          However, three separate staff members have
          reported hearing the same footsteps.
        </p>

        <p>
          No person has been found in the corridor
          during any of these incidents.
        </p>

        <p>
          Patient refuses to remain alone after
          midnight and repeatedly asks to be moved
          to another ward.
        </p>

        <div class="document-warning">

          <strong>HANDWRITTEN NOTE</strong>

          <p>
            "If you're reading this, don't trust the
            room numbers."
          </p>

          <p>
            "The room they call <strong>417</strong>
            isn't where it should be."
          </p>

        </div>

        <div class="document-footer">
          WARD C • PATIENT RECORD
        </div>

      </div>

    </div>
  `;


  document.body.appendChild(
    overlay
  );


  // ------------------------------------
  // CLOSE BUTTON
  // ------------------------------------

  const closeButton =
    overlay.querySelector(
      "#document-close"
    );


  closeButton.addEventListener(
    "click",
    () => {

      closeDocument();

    }
  );


  // ------------------------------------
  // ESCAPE
  // ------------------------------------

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.code === "Escape" &&
        overlay.classList.contains("visible")
      ) {

        closeDocument();

      }

    }
  );


  function openDocument() {

    document.exitPointerLock?.();

    if (onOpen) {
      onOpen();
    }

    overlay.classList.add(
      "visible"
    );

  }


  function closeDocument() {

    if (!overlay.classList.contains("visible")) {
      return;
    }

    overlay.classList.remove(
      "visible"
    );

    if (onClose) {
      onClose();
    }

  }


  return {
    open: openDocument,
    close: closeDocument,
  };

}
