import { Field, Form, Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "react-bootstrap";
import { capitalize } from "../../../utility/stringUtil";
import Image from "next/image";
import { ChangeEvent, FormEventHandler, useState } from "react";

export interface CreateGoalsSubFormProps {
    goals: string[];
    setGoals: (goals: string[]) => void;
}

export default function CreateGoalsSubForm({ goals, setGoals }: CreateGoalsSubFormProps) {
    const { t } = useTranslation("common");

    const [currentGoal, setCurrentGoal] = useState<string>("");

    function submitHandler() {
        setGoals([...goals, currentGoal]);
        setCurrentGoal("");
    }

    return (
        <div>
            {goals.map((goal: string, index: number) => (
                <Row key={index}>
                    <Col>{goal}</Col>
                    <Col xs={1}>
                        <a>
                            <Image
                                onClick={() => setGoals(goals.filter((_, valIndex) => valIndex !== index))}
                                alt=""
                                src={"/resources/delete.svg"}
                                width="15"
                                height="15"
                            />
                        </a>
                    </Col>
                </Row>
            ))}
            <input
                className="form-control mb-2"
                data-testid="goal-input"
                value={currentGoal}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentGoal(e.target.value)}
                placeholder={capitalize(t("project goal"))}
            />
            <button
                className="btn btn-secondary"
                type="button"
                data-testid="add-goal-button"
                onClick={submitHandler}
            >
                {capitalize(t("add goal"))}
            </button>
        </div>
    );
}
