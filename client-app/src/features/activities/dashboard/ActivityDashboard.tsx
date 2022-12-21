import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid, Loader } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";

import ActivityList from "./ActivityList";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceHolder";

export default observer(function ActivityDashboard(){
    const {activityStore}=useStore();

    const {loadActitivies,activityRegister,pagination,setPaginsParams}=activityStore
    const [loadingNext,setLoadingNext]=useState(false);

    function handleGetNext(){
        setLoadingNext(true);
        setPaginsParams(new PagingParams(pagination!.currentPage+1));
        loadActitivies().then(()=>setLoadingNext(false));
    }//end handleGetNext

    useEffect(()=>{
        if (activityRegister.size<=1) {
            loadActitivies();
        }//end if (activityRegister.size==0) 
    },[activityRegister.size,loadActitivies]);



    
    return(
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder/>
                        <ActivityListItemPlaceholder/>
                    </>
                ) : (
                    <InfiniteScroll pageStart={0} loadMore={handleGetNext} 
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages} initialLoad={false}
                    >
                        <ActivityList/>
                    </InfiniteScroll>

                )}
            </Grid.Column>
            <Grid.Column width={'6'}>
                <ActivityFilters/>
                {/* Th>is code is for avoid an eror when you cascade the component
                This ActivityDetails component load before get access to the activity object
                doesn't know if activity object exist
                The way to fix is make sure that object exist.
                "selectedActivity &&"  this mean.
                Anything to the right of "&&" will execute if 
                selectedActivity is not null or undefined */}
                {/* {selectedActivity && !editMode && <ActivityDetails/>}
                {editMode && <ActivityForm />} */}
            </Grid.Column>
            <Grid.Column width={'10'}>
                <Loader active={loadingNext}/>
            </Grid.Column>
        </Grid>

    );//end return
    




    

}//end ActivityDashboard
)