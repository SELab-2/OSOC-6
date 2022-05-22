import { Col, Row } from "react-bootstrap";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import styles from "../../styles/projects/createProject.module.css";
import { capitalize } from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";

/**
 * Props needed for the ItemListForm component.
 */
export interface StringListFormFormProps {
    items: string[];
    setItems: (itmes: string[]) => void;
    itemInputText: string;
    itemAddText: string;
    itemPlaceHolderText?: string;
}

/**
 * An ItemListForm is an input with an add button. It can be used to add multiple inputs to a state.
 * Once an input has been added, it appears with a delete button next to it.
 * @param items the list of items to display
 * @param setItems the state setter of the items list
 * @param itemInputText the text used for the input label
 * @param itemAddText the text used for the add button
 * @param itemPlaceHolderText the text used for the input placeholder
 */
export default function ItemListForm({
    items,
    setItems,
    itemInputText,
    itemAddText,
    itemPlaceHolderText,
}: StringListFormFormProps) {
    const [currentItem, setCurrentItem] = useState<string>("");
    const { t } = useTranslation("common");

    function submitHandler() {
        setItems([...items, currentItem]);
        setCurrentItem("");
    }

    return (
        <div>
            <label className={styles.label + " form-label"} htmlFor="item-input">
                {itemInputText}
            </label>
            <ul style={{ listStyleType: "circle" }}>
                {/*No items*/}
                {items.length === 0 && (
                    <Row style={{ justifyContent: "center" }}>{capitalize(t("no items added yet"))}</Row>
                )}

                {items.map((item: string, index: number) => (
                    <li key={index} style={{ marginLeft: "3rem" }}>
                        <Row>
                            <Col>{item}</Col>
                            <Col xs={1}>
                                <a
                                    onClick={() =>
                                        setItems(items.filter((_, valIndex) => valIndex !== index))
                                    }
                                    data-testid={"item-list-delete-button"}
                                >
                                    <Image
                                        layout="fixed"
                                        className="clickable"
                                        alt=""
                                        src={"/resources/delete.svg"}
                                        width="15"
                                        height="15"
                                    />
                                </a>
                            </Col>
                        </Row>
                    </li>
                ))}
            </ul>
            <input
                id="item-input"
                className={styles.input_field + " form-control mb-2"}
                data-testid="item-list-input"
                value={currentItem}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentItem(e.target.value)}
                placeholder={itemPlaceHolderText ? itemPlaceHolderText : itemInputText}
            />
            <div style={{ display: "flex" }}>
                <button
                    style={{ marginLeft: "auto", marginRight: "0" }}
                    className="btn btn-secondary"
                    type="button"
                    data-testid="item-list-add-button"
                    onClick={submitHandler}
                >
                    {itemAddText}
                </button>
            </div>
        </div>
    );
}
