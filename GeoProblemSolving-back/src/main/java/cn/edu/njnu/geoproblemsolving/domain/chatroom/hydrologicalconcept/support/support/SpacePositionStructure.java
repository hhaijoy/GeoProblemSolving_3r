package cn.edu.njnu.geoproblemsolving.domain.chatroom.hydrologicalconcept.support.support;

import cn.edu.njnu.geoproblemsolving.domain.chatroom.hydrologicalconcept.support.userimage.UserImage;
import lombok.Data;

import java.util.List;

@Data
public class SpacePositionStructure {
    String type;
    String desc;
    String[] tags;
    List<UserImage> relateImages;
}
