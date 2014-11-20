package uk.ac.ic.wlgitbridge.writelatex.model.db.sql;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Winston on 20/11/14.
 */
public interface SQLQuery<T> extends SQLUpdate {

    public T processResultSet(ResultSet resultSet) throws SQLException;

}
