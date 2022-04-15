import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import { getUserInfo } from "../api/UserEntity";
import styles from "../styles/profileOverview.module.css";
import { profileDeleteHandler, profileSaveHandler } from '../handlers/profileHandler';

export function ProfileOverview() {
    const { t } = useTranslation("common");
    const [data, setData] = useState<any>();
    const [editCallname, setEditCallname] = useState<boolean>(false);
    const [callname, setCallname] = useState<string>('');

    useEffect(() => {
        getUserInfo(apiPaths.ownUser).then((response) => setData(response));
    }, []);

    if (!data) {
        return null;
    }

    function handleEditCallName(){
        setEditCallname(true);
    }

    function handleSaveCallName(){
        setEditCallname(false);
        profileSaveHandler(data._links.self.href, callname).then(respone => {
            if(respone.status == 200){
                setData(respone.data);
            } else {
                // TODO Show toats that PATCH failed
            }
        });
    }

    function onChange(event: any) {
        // Intended to run on the change of every form element
        event.preventDefault();
        setCallname(event.target.value);
    }


    return (
        <Container>
            <h2>{t("UserOverview My Profile")}</h2>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Name")}</Col>
                {/*show callname if not editing*/}
                {!editCallname && <Col>{data.callName}</Col>}
                {!editCallname && <Col>
                    <a onClick={handleEditCallName}>
                        <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                    </a>
                    </Col>
                }

                {/*input field and save mark if editing*/}
                {editCallname && <Col>
                    <input name="callname" value={data.callName} onChange={onChange} />
                    <button onClick={handleSaveCallName}>
                        <Image alt="" src={"/resources/checkmark.svg"} width="15" height="15" />
                    </button>
                </Col>}
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview E-mail")}</Col>
                <Col>{data.email}</Col>
                <Col>
                    <a href={applicationPaths.changeEmail}>
                        <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                    </a>
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Password")}</Col>
                <Col>******</Col>
                <Col>
                    <a href={applicationPaths.changePassword}>
                        <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                    </a>
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Status")}</Col>
                <Col>
                    {data.userRole == "ADMIN" && <a>Admin</a>}
                    {data.userRole == "COACH" && <a>Coach</a>}
                </Col>
            </Row>
            <Row>
                <Button onClick={(event) => profileDeleteHandler(event)} value={data._links.self.href}>Delete my profile</Button>
            </Row>
        </Container>
    );
}

export default ProfileOverview;
