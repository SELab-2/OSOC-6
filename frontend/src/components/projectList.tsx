import {Button, ListGroup, Pagination} from 'react-bootstrap';
import {getAllProjects, IProject} from "../api/ProjectEntity";
import axios from 'axios';
import Router from 'next/router';
import styles from '../styles/projectList.module.css';
import { NewProjectButton } from './newProjectButton';
import useTranslation from 'next-translate/useTranslation';
import {useEffect, useState} from "react";
import pathNames from "../properties/pathNames";

export const ProjectList = () => {
    const { t } = useTranslation();

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const projects = getAllProjects().then((response) => setData(response));
    }, []);

    if (!data) {
        return null;
    }

    return (
        <div className={styles.project_list}>
            <ListGroup as="ul" className="overflow-scroll">
                <ListGroup.Item className={styles.project_list_header}>{t('common:Project list header')}</ListGroup.Item>
                {data.map((project) => (
                    <ListGroup.Item
                        className={styles.project_list_project}
                        action
                        as={'li'}
                        key={project.id}
                        // Should be changed to individual project page later
                        onClick={() => Router.push(pathNames.projects)}
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

