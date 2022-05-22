import mailTo from "../../src/utility/mailTo";

describe("mail to", () => {
    it("handles no args", () => {
        expect(mailTo()).toEqual("");
    });

    it("handles only recipient", () => {
        expect(mailTo({ recipients: ["bob", "flip"] })).toEqual("mailto:bob;flip");
    });

    it("handles only subject", () => {
        expect(mailTo({ subject: "test" })).toEqual("mailto:?subject=test");
    });

    it("handles only body", () => {
        expect(mailTo({ body: "test" })).toEqual("mailto:?body=test");
    });

    it("handles all args", () => {
        expect(
            mailTo({
                subject: "subj",
                body: "body",
                recipients: ["Jef"],
            })
        ).toEqual("mailto:Jef?subject=subj&body=body");
    });
});
