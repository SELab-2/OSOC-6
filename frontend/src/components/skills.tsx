import {useEffect, useState} from "react";
import axios from "axios";
import {AxiosConf} from "../api/requests";
import Dict = NodeJS.Dict;
import {IProjectSkillPage} from "../api/ProjectSkillEntity";

export default function Skills(u:Dict<string>){
    const url:string = u['u']!
    const [skills, setSkills] = useState<IProjectSkillPage>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProjects() {
            const response: IProjectSkillPage = (await axios.get(url, AxiosConf)).data;
            setSkills(response)
            setLoading(false)
        }
        fetchProjects()
    }, [])

    if (loading) {
        return <h3>Loading ...</h3>
    }

    const skillsList = skills!._embedded["project-skills"]
    if (skillsList == undefined) {
        return <p>No skills found</p>
    }

    return (
        <>
            <h4>
                {skillsList.map((skill, index) => {
                    return <p key={index}>{skill.name}</p>
                })}
            </h4>
        </>
    );
}