export function createKeypad({
    correctCode,
    onSuccess,
    onClose,
}) {

    // ====================================
    // CODE CONFIG
    // ====================================

    const expectedCode =
        String(correctCode);

    const codeLength =
        expectedCode.length;


    // ====================================
    // OVERLAY
    // ====================================

    const overlay =
        document.createElement("div");

    overlay.id =
        "keypad-overlay";


    // ====================================
    // DISPLAY SLOTS
    // ====================================

    const displaySlots =
        Array.from(
            {
                length: codeLength,
            },
            () => "<span>_</span>"
        ).join("");


    // ====================================
    // HTML
    // ====================================

    overlay.innerHTML = `

    <div class="keypad">

      <button
        class="keypad-close"
        id="keypad-close"
        type="button"
      >
        ×
      </button>


      <div class="keypad-title">
        ENTER CODE
      </div>


      <div
        class="keypad-display"
        id="keypad-display"
      >
        ${displaySlots}
      </div>


      <div class="keypad-buttons">

        <button
          data-number="1"
          type="button"
        >
          1
        </button>

        <button
          data-number="2"
          type="button"
        >
          2
        </button>

        <button
          data-number="3"
          type="button"
        >
          3
        </button>


        <button
          data-number="4"
          type="button"
        >
          4
        </button>

        <button
          data-number="5"
          type="button"
        >
          5
        </button>

        <button
          data-number="6"
          type="button"
        >
          6
        </button>


        <button
          data-number="7"
          type="button"
        >
          7
        </button>

        <button
          data-number="8"
          type="button"
        >
          8
        </button>

        <button
          data-number="9"
          type="button"
        >
          9
        </button>


        <button
          data-number="0"
          type="button"
        >
          0
        </button>

      </div>


      <div class="keypad-actions">

        <button
          class="keypad-backspace"
          id="keypad-backspace"
          type="button"
        >
          ⌫
        </button>


        <button
          class="keypad-enter"
          id="keypad-enter"
          type="button"
        >
          ENTER
        </button>

      </div>


      <div
        class="keypad-message"
        id="keypad-message"
      ></div>

    </div>

  `;


    document.body.appendChild(
        overlay
    );


    // ====================================
    // ELEMENTS
    // ====================================

    const display =
        overlay.querySelector(
            "#keypad-display"
        );


    const message =
        overlay.querySelector(
            "#keypad-message"
        );


    const backspaceButton =
        overlay.querySelector(
            "#keypad-backspace"
        );


    const enterButton =
        overlay.querySelector(
            "#keypad-enter"
        );


    const closeButton =
        overlay.querySelector(
            "#keypad-close"
        );


    let enteredCode =
        "";


    // ====================================
    // UPDATE DISPLAY
    // ====================================

    function updateDisplay() {

        const slots =
            display.querySelectorAll(
                "span"
            );


        slots.forEach(
            (slot, index) => {

                slot.textContent =
                    enteredCode[index] ||
                    "_";

            }
        );

    }


    // ====================================
    // ADD DIGIT
    // ====================================

    function addDigit(
        digit
    ) {

        if (
            enteredCode.length >=
            codeLength
        ) {

            return;

        }


        enteredCode +=
            digit;


        message.textContent =
            "";


        updateDisplay();

    }


    // ====================================
    // BACKSPACE
    // ====================================

    function backspace() {

        if (
            enteredCode.length === 0
        ) {

            return;

        }


        enteredCode =
            enteredCode.slice(
                0,
                -1
            );


        message.textContent =
            "";


        updateDisplay();

    }


    // ====================================
    // SUBMIT CODE
    // ====================================

    function submitCode() {

        // --------------------------------
        // CHECK LENGTH
        // --------------------------------

        if (
            enteredCode.length !==
            codeLength
        ) {

            message.textContent =
                `ENTER ${codeLength} DIGITS`;

            return;

        }


        // ==================================
        // CORRECT
        // ==================================

        if (
            enteredCode ===
            expectedCode
        ) {

            message.textContent =
                "ACCESS GRANTED";


            setTimeout(
                () => {

                    close();


                    if (
                        onSuccess
                    ) {

                        onSuccess();

                    }

                },
                500
            );


            return;

        }


        // ==================================
        // INCORRECT
        // ==================================

        message.textContent =
            "INCORRECT CODE";


        enteredCode =
            "";


        updateDisplay();

    }


    // ====================================
    // NUMBER BUTTONS
    // ====================================

    const numberButtons =
        overlay.querySelectorAll(
            "[data-number]"
        );


    numberButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    addDigit(
                        button.dataset.number
                    );

                }
            );

        }
    );


    // ====================================
    // BACKSPACE BUTTON
    // ====================================

    backspaceButton.addEventListener(
        "click",
        () => {

            backspace();

        }
    );


    // ====================================
    // ENTER BUTTON
    // ====================================

    enterButton.addEventListener(
        "click",
        () => {

            submitCode();

        }
    );


    // ====================================
    // CLOSE BUTTON
    // ====================================

    closeButton.addEventListener(
        "click",
        () => {

            close();

        }
    );


    // ====================================
    // KEYBOARD INPUT
    // ====================================

    function handleKeyboard(
        event
    ) {

        // --------------------------------
        // IGNORE IF CLOSED
        // --------------------------------

        if (
            !overlay.classList.contains(
                "visible"
            )
        ) {

            return;

        }


        // ==================================
        // NUMBER KEYS
        // ==================================

        if (
            /^[0-9]$/.test(
                event.key
            )
        ) {

            event.preventDefault();


            addDigit(
                event.key
            );


            return;

        }


        // ==================================
        // BACKSPACE
        // ==================================

        if (
            event.key ===
            "Backspace"
        ) {

            event.preventDefault();


            backspace();


            return;

        }


        // ==================================
        // ENTER
        // ==================================

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();


            submitCode();


            return;

        }


        // ==================================
        // ESCAPE
        // ==================================

        if (
            event.key ===
            "Escape"
        ) {

            event.preventDefault();


            close();

        }

    }


    document.addEventListener(
        "keydown",
        handleKeyboard
    );


    // ====================================
    // OPEN
    // ====================================

    function open() {

        document.exitPointerLock?.();

        enteredCode =
            "";


        updateDisplay();


        message.textContent =
            "";


        overlay.classList.add(
            "visible"
        );

    }


    // ====================================
    // CLOSE
    // ====================================

    function close() {

        overlay.classList.remove(
            "visible"
        );


        enteredCode =
            "";


        updateDisplay();


        message.textContent =
            "";


        if (
            onClose
        ) {

            onClose();

        }

    }


    // ====================================
    // RETURN
    // ====================================

    return {

        open,

        close,

    };

}
