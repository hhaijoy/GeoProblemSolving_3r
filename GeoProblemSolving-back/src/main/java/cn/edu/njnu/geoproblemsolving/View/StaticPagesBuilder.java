package cn.edu.njnu.geoproblemsolving.View;
import cn.edu.njnu.geoproblemsolving.Dao.Project.ProjectDaoImpl;
import cn.edu.njnu.geoproblemsolving.Entity.ProjectEntity;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.OutputStreamWriter;

@Component
public class StaticPagesBuilder {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public StaticPagesBuilder(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public void projectDetailPageBuilder(String projectId) {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");//模板所在目录，相对于当前classloader的classpath。
        resolver.setSuffix(".html");//模板文件后缀
        TemplateEngine templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(resolver);

        Context context = new Context();
        Query queryProjectInfo = new Query(Criteria.where("projectId").is(projectId));
        ProjectEntity projectEntity = mongoTemplate.findOne(queryProjectInfo, ProjectEntity.class);
        context.setVariable("projectInfo", projectEntity);
        context.setVariable("activeName", "projects");

        //渲染模板
        String servicePath = getServicePath();
        String htmlPath = servicePath+"/staticPage/project";
        File temp = new File(htmlPath);
        if (!temp.exists()) {
            temp.mkdirs();
        }
        String htmlFile = htmlPath+"/"+projectId+".html";
        try{
            if(projectEntity!=null){
                OutputStreamWriter write = new OutputStreamWriter(new FileOutputStream(htmlFile),"UTF-8");
                templateEngine.process("projectDetail", context,write);
                write.flush();
                write.close();
            }
        }catch (Exception ignored){}
    }

    public void projectListPageBuilder() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");//模板所在目录，相对于当前classloader的classpath。
        resolver.setSuffix(".html");//模板文件后缀
        TemplateEngine templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(resolver);

        ProjectDaoImpl projectDao = new ProjectDaoImpl(mongoTemplate);
        JSONObject result = (JSONObject)projectDao.inquiryByPage("All", "", 1, 18, "","");

        Context context = new Context();
        context.setVariable("projectsInfo", result);

        //渲染模板
        String servicePath = getServicePath();
        String htmlPath = servicePath + "/staticPage";
        File temp = new File(htmlPath);
        if (!temp.exists()) {
            temp.mkdirs();
        }
        String htmlFile = htmlPath + "/projectList.html";
        try {
            OutputStreamWriter write = new OutputStreamWriter(new FileOutputStream(htmlFile),"UTF-8");
            templateEngine.process("projectList", context, write);
            write.flush();
            write.close();
        } catch (Exception ignored) {
        }
    }

    public void homePageBuilder() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        String servicePath = getServicePath();
        resolver.setPrefix("templates/");//模板所在目录，相对于当前classloader的classpath。
        resolver.setSuffix(".html");//模板文件后缀
        TemplateEngine templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(resolver);

        Context context = new Context();
        String htmlPath = servicePath + "/staticPage";
        File temp = new File(htmlPath);
        if (!temp.exists()) {
            temp.mkdirs();
        }
        String htmlFile = htmlPath + "/home.html";
        try {
            FileWriter write = new FileWriter(htmlFile);
            templateEngine.process("home", context, write);//优化点，写加锁
            write.flush();
            write.close();
        } catch (Exception ignored) {
        }
    }

    private String getServicePath(){
        String servicePath = System.getProperty("user.dir")+"/src/main/resources/templates";
//        String servicePath = System.getProperty("user.dir")+"/src/main/webapp"; //部署使用
        return servicePath.replaceAll("\\\\","/");
    }
}




