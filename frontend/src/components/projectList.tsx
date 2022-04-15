import { ListGroup } from "react-bootstrap";
import Router from "next/router";
import styles from "../styles/projectList.module.css";
import { NewProjectButton } from "./newProjectButton";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import apiPaths from "../properties/apiPaths";
import { getAllProjectsFormLinks } from "../api/calls/projectCalls";

export const ProjectList = () => {
    const { t } = useTranslation();

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setData(await getAllProjectsFormLinks(apiPaths.projects));
        };
        fetchData().catch(console.log);
    }, []);

    if (!data) {
        return null;
    }

    return (
        <div className={styles.project_list}>
            <ListGroup as="ul" className="overflow-scroll">
                <ListGroup.Item
                    data-testid="projectlist-header"
                    className={styles.project_list_header}
                >
                    {t("common:Project list header")}
                </ListGroup.Item>
                {data.map((project) => (
                    <ListGroup.Item
                        key={project._links.self.href.split(apiPaths.projects)[1]}
                        className={styles.project_list_project}
                        action
                        as={"li"}
                        // Should be changed to individual project page later
                        onClick={() => {
                            let projectPath: string = project._links.self.href.split(
                                apiPaths.base
                            )[1];
                            Router.push(projectPath);
                        }}
                    >
                        <h5 className="mb-1">{project.name}</h5>
                        <small>{project.partnerName}</small>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <NewProjectButton />
        </div>
    );
};
