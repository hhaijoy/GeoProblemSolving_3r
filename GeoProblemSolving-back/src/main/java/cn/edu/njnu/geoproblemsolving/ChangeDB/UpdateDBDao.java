package cn.edu.njnu.geoproblemsolving.ChangeDB;

import cn.edu.njnu.geoproblemsolving.Dao.Step.StepDaoImpl;
import cn.edu.njnu.geoproblemsolving.Entity.*;
import cn.edu.njnu.geoproblemsolving.Entity.Folder.FolderEntity;
import cn.edu.njnu.geoproblemsolving.Entity.Folder.FolderItem;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

import java.util.ArrayList;
import java.util.List;

@Component
public class UpdateDBDao {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public UpdateDBDao(MongoTemplate mongoTemplate){
        this.mongoTemplate=mongoTemplate;
    }

    public String createProjectFolder(){
        List<ProjectEntity> projects = mongoTemplate.findAll(ProjectEntity.class);
        for(ProjectEntity project:projects){
            String projectId = project.getProjectId();
            Query query = new Query(Criteria.where("scope.projectId").is(projectId));
            FolderEntity folderEntity = new FolderEntity();
            folderEntity.setParentId("");
            folderEntity.setFolderName(project.getTitle());
            folderEntity.setFolderId(projectId);
            folderEntity.setFolders(new ArrayList<>());
            List<ResourceEntity> resources = mongoTemplate.find(query,ResourceEntity.class);
            ArrayList<ResourceEntity> files = new ArrayList<>(resources);
            folderEntity.setFiles(files);
            mongoTemplate.save(folderEntity);
        }
        return "Success";
    }

    public String fileStrucToFolder(){
        List<OldSubProjectEntity> subProjects = mongoTemplate.findAll(OldSubProjectEntity.class);
        for(OldSubProjectEntity subProject : subProjects){
            try {
                String fileStruc = subProject.getFileStruct();
                if(fileStruc != null){
                    FileStructEntity fileStructEntity = JSONObject.parseObject(fileStruc,FileStructEntity.class);
                    transToFolder(fileStructEntity,"");
                }else {
                    FolderEntity folderEntity = new FolderEntity();
                    folderEntity.setFiles(new ArrayList<>());
                    folderEntity.setFolders(new ArrayList<>());
                    folderEntity.setFolderId(subProject.getSubProjectId());
                    folderEntity.setFolderName(subProject.getTitle());
                    folderEntity.setParentId("");
                    mongoTemplate.save(folderEntity);
                }
            }catch (Exception e){
                continue;
            }
        }
        return "Success";
    }

    private void transToFolder(FileStructEntity fileStruct, String parentId){
        String name = fileStruct.getName();
        String uid = fileStruct.getUid();
        ArrayList<FileStructEntity> folders = fileStruct.getFolders();
        ArrayList<FileNodeEntity> files = fileStruct.getFiles();

        FolderEntity folderEntity = new FolderEntity();
        folderEntity.setParentId(parentId);
        folderEntity.setFolderId(uid);
        folderEntity.setFolderName(name);

        ArrayList<FolderItem> ffolders = new ArrayList();
        for (FileStructEntity folder:folders){
            FolderItem folderItem = new FolderItem();
            folderItem.setName(folder.getName());
            folderItem.setUid(folder.getUid());
            ffolders.add(folderItem);
        }
        folderEntity.setFolders(ffolders);

        ArrayList<ResourceEntity> ffiles = new ArrayList<>();
        for(FileNodeEntity file:files){
            String resourceId = file.getUid();
            Query query = new Query(Criteria.where("resourceId").is(resourceId));
            ResourceEntity resourceEntity = mongoTemplate.findOne(query,ResourceEntity.class);
            ffiles.add(resourceEntity);
        }
        folderEntity.setFiles(ffiles);

        mongoTemplate.save(folderEntity);

        for (FileStructEntity folder:folders){
            transToFolder(folder,fileStruct.getUid());
        }
    }

    public String foldersAddScopeId(){
        try{
            List<ProjectEntity> projectEntities = mongoTemplate.findAll(ProjectEntity.class);
            List<SubProjectEntity> subProjectEntities = mongoTemplate.findAll(SubProjectEntity.class);
            List<ModuleEntity> moduleEntities = mongoTemplate.findAll(ModuleEntity.class);
            for (ProjectEntity projectEntity:projectEntities){
                Query query = new Query(Criteria.where("folderId").is(projectEntity.getProjectId()));
                FolderEntity folderEntity = mongoTemplate.findOne(query,FolderEntity.class);
                folderAddScopeId(folderEntity,projectEntity.getProjectId());
            }
            for (SubProjectEntity subProjectEntity:subProjectEntities){
                Query query = new Query(Criteria.where("folderId").is(subProjectEntity.getSubProjectId()));
                FolderEntity folderEntity = mongoTemplate.findOne(query,FolderEntity.class);
                folderAddScopeId(folderEntity,subProjectEntity.getSubProjectId());
            }
            for (ModuleEntity moduleEntity:moduleEntities){
                Query query = new Query(Criteria.where("folderId").is(moduleEntity.getSubProjectId()));
                FolderEntity folderEntity = mongoTemplate.findOne(query,FolderEntity.class);
                folderAddScopeId(folderEntity,moduleEntity.getModuleId());
            }
            return "Success";
        }catch (Exception e){
            return "Fail";
        }
    }

    private void folderAddScopeId(FolderEntity folderEntity, String scopeId){
        Query query = new Query(Criteria.where("folderId").is(folderEntity.getFolderId()));
        Update update = new Update();
        update.set("scopeId",scopeId);
        mongoTemplate.updateFirst(query,update,FolderEntity.class);
        ArrayList<FolderItem> folderItems = folderEntity.getFolders();
        for(FolderItem folderItem : folderItems){
            Query query1 = new Query(Criteria.where("folderId").is(folderItem.getUid()));
            FolderEntity folderEntity1 = mongoTemplate.findOne(query1,FolderEntity.class);
            folderAddScopeId(folderEntity1,scopeId);
        }
    }

    public String moduleToStepTree(){
        try{
            List<SubProjectEntity> subProjectEntities = mongoTemplate.findAll(SubProjectEntity.class);
            for(SubProjectEntity subProject : subProjectEntities){
                Query query = new Query(Criteria.where("subProjectId").is(subProject.getSubProjectId()));
                List<ModuleEntity> moduleEntities = mongoTemplate.find(query,ModuleEntity.class);
                if(moduleEntities.size()>0){
                    ArrayList<StepNodeEntity> stepNodes = new ArrayList<>();
                    for(int i=0;i<moduleEntities.size();i++){
                        ModuleEntity moduleInfo = moduleEntities.get(i);
                        StepEntity stepEntity = new StepEntity();
                        stepEntity.setType(transStepType(moduleInfo.getType()));
                        stepEntity.setName(moduleInfo.getTitle());
                        stepEntity.setDescription(moduleInfo.getDescription());
                        stepEntity.setSubProjectId(moduleInfo.getSubProjectId());
                        stepEntity.setCreator(moduleInfo.getCreator());
                        stepEntity.setContent(new JSONObject());

                        StepNodeEntity stepNode = new StepNodeEntity();
                        stepNode.setId(i);
                        StepDaoImpl  stepDao = new StepDaoImpl(mongoTemplate);
                        stepNode.setStepID(stepDao.createStep(stepEntity));
                        stepNode.setName(stepEntity.getName());
                        stepNode.setCategory(transStepCategory(stepEntity.getType()));
                        ArrayList<StepListNodeEntity> last = new ArrayList<>();
                        if (i!=0){
                            StepListNodeEntity stepListNodeEntity = new StepListNodeEntity();
                            stepListNodeEntity.setId(i-1);
                            stepListNodeEntity.setName(moduleEntities.get(i-1).getTitle());
                            last.add(stepListNodeEntity);
                        }
                        stepNode.setLast(last);
                        ArrayList<StepListNodeEntity> next = new ArrayList<>();
                        if(i!=moduleEntities.size()-1){
                            StepListNodeEntity stepListNodeEntity = new StepListNodeEntity();
                            stepListNodeEntity.setId(i+1);
                            stepListNodeEntity.setName(moduleEntities.get(i+1).getTitle());
                            next.add(stepListNodeEntity);
                        }
                        stepNode.setNext(next);
                        if(i==0){
                            stepNode.setX(0);
                        }
                        else {
                            stepNode.setX(i*((float)800/(float)moduleEntities.size()));
                        }
                        stepNode.setY(200);
                        stepNode.setLevel(i);
                        if(i!=moduleEntities.size()-1){
                            stepNode.setEnd(false);
                            stepNode.setActiveStatus(false);
                        }
                        else {
                            stepNode.setEnd(true);
                            stepNode.setActiveStatus(true);
                        }
                        stepNodes.add(stepNode);
                    }
                    Update update = new Update();
                    update.set("solvingProcess",JSONObject.toJSONString(stepNodes));
                    mongoTemplate.updateFirst(query,update,SubProjectEntity.class);
                }
            }
            return "Success";
        }catch (Exception e){
            return "Fail";
        }
    }

    private String transStepType(String oldType){
        switch (oldType){
            case "Preparation":
                return "Context definition & resource collection";
            case "Analysis":
                return "Data processing";
            case "Modeling":
                return "Modeling for geographic process";
            case "Simulation":
                return "Simulation/Prediction";
            case "Validation":
                return "Visualization & representation";
            case "Comparison":
                return "Model evaluation";
            default:
                return "Decision-making & management";
        }
    }

    private int transStepCategory(String type){
        switch (type){
            case "Context definition & resource collection":
                return 0;
            case "Data processing":
                return 1;
            case "Modeling for geographic process":
                return 2;
            case "Model evaluation":
                return 3;
            case "Quantitative and qualitative analysis":
                return 4;
            case "Simulation/Prediction":
                return 5;
            case "Visualization & representation":
                return 6;
            default:
                return 7;
        }
    }

    public String md5Password(){
        try{
            List<UserEntity> userEntities = mongoTemplate.findAll(UserEntity.class);
            for(UserEntity userEntity:userEntities){
                String passWordMD5 = DigestUtils.md5DigestAsHex(userEntity.getPassword().getBytes());
                Query query = new Query(Criteria.where("userId").is(userEntity.getUserId()));
                Update update = new Update();
                update.set("password",passWordMD5);
                mongoTemplate.updateFirst(query,update,UserEntity.class);
            }
            return "Success";
        }catch (Exception e){
            return "Fail";
        }
    }
}
