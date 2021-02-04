import {
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLList
} from 'graphql';
import axios from 'axios';


const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields:()=>({
        flight_number: {type: GraphQLInt},
        mission_name: {type: GraphQLString},
        launch_year: {type: GraphQLString},
        launch_data_local: {type: GraphQLString},
        launch_success: {type: GraphQLBoolean},
        rocket: {type: RocketType}
    })
});


const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields:()=>({
        rocket_id: {type: GraphQLString},
        rocket_name: {type: GraphQLString},
        rocket_type: {type: GraphQLString},
    })
});


// rootQuery
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        launces: {
            type: new GraphQLList(LaunchType),
            resolve(parent, args){
                return axios.get('https://api.spacexdata.com/v3/launches')
                        .then(res => res.data);
            }
        },
        launch:{
            type : LaunchType,
            args: { flight_number: {type: GraphQLInt}},
            resolve(parent, args){
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                                .then(res => res.data)
            }
        }
    }
})


export default new GraphQLSchema({
    query: RootQuery
});