import {Col, Row} from "react-bootstrap";
import Image from "next/image";
import {ChangeEvent, useState} from "react";

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
export default function ItemListForm({ items, setItems, itemInputText, itemAddText, itemPlaceHolderText }: StringListFormFormProps) {
    const [currentItem, setCurrentItem] = useState<string>("");

    function submitHandler() {
        setItems([...items, currentItem]);
        setCurrentItem("");
    }

    return (
        <div>
            {items.map((item: string, index: number) => (
                <Row key={index}>
                    <Col>{item}</Col>
                    <Col xs={1}>
                        <a
                            onClick={() => setItems(items.filter((_, valIndex) => valIndex !== index))}
                            data-testid={"remove-added-item-" + item}
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
            ))}
            <label htmlFor="item-input" className="form-label">{itemInputText}</label>
            <input
                id="item-input"
                className="form-control mb-2"
                data-testid="item-list-input"
                value={currentItem}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentItem(e.target.value)}
                placeholder={itemPlaceHolderText ? itemPlaceHolderText : itemInputText}
            />
            <button
                className="btn btn-secondary"
                type="button"
                data-testid="item-list-add-button"
                onClick={submitHandler}
            >
                {itemAddText}
            </button>
        </div>
    );
}
