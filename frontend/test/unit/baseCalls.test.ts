import { removeParamFormUrl } from "../../src/api/calls/baseCalls";

describe("baseCalls", () => {
    describe("removeParamFormUrl", () => {
        it("does nothing when param not contained", () => {
            expect(removeParamFormUrl("localhost/assignStudents?edition=Edition 1", "apple"))
                .toEqual("localhost/assignStudents?edition=Edition 1")
        })

        it("removes solo param", () => {
            expect(removeParamFormUrl("localhost/assignStudents?edition=Edition 1", "edition"))
                .toEqual("localhost/assignStudents")
        })


        it("removes duo param when first", () => {
            expect(removeParamFormUrl("localhost/assignStudents?edition=Edition 1&solo=false", "edition"))
                .toEqual("localhost/assignStudents?solo=false")
        })

        it("removes duo param when second", () => {
            expect(removeParamFormUrl("localhost/assignStudents?solo=false&edition=Edition 1", "edition"))
                .toEqual("localhost/assignStudents?solo=false")
        })

        it("removes trio param when middle", () => {
            expect(removeParamFormUrl("localhost/assignStudents?solo=false&edition=Edition 1&trio=true", "edition"))
                .toEqual("localhost/assignStudents?solo=false&trio=true")
        })

        it("removes trio param when first", () => {
            expect(removeParamFormUrl("localhost/assignStudents?edition=Edition 1&solo=false&trio=true", "edition"))
                .toEqual("localhost/assignStudents?solo=false&trio=true")
        })

        it("removes trio param when last", () => {
            expect(removeParamFormUrl("localhost/assignStudents?solo=false&trio=true&edition=Edition 1", "edition"))
                .toEqual("localhost/assignStudents?solo=false&trio=true")
        })
    });
})