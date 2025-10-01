import PropTypes from 'prop-types';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../../ui-component/cards/Skeleton/EarningCard';
import EarningIcon from '../../../assets/images/icons/earning.svg';

const EarningCard = ({ isLoading, value }) => {
    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <MainCard border={false} content={false} sx={{ bgcolor: 'secondary.dark', color: '#fff', overflow: 'hidden', position: 'relative' }}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar variant="rounded" sx={{ bgcolor: 'secondary.800' }}>
                                            <img src={EarningIcon} alt="Notification" />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        {/* SỬA LẠI DÒNG NÀY */}
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            ${(value ?? 0).toFixed(2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'secondary.200' }}>
                                    Total Revenue
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool,
    value: PropTypes.number,
};

export default EarningCard;